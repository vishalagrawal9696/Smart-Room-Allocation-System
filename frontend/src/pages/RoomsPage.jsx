import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRooms } from "../store/slices/roomSlice";
import RoomCard from "../components/rooms/RoomCard";
import RoomFilters from "../components/rooms/RoomFilters";
import AddEditRoomModal from "../components/rooms/AddEditRoomModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import { Building2, PlusCircle } from "lucide-react";

export default function RoomsPage() {
  const dispatch = useDispatch();
  const { rooms, loading, pagination } = useSelector((s) => s.rooms);
  const [editRoom, setEditRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    dispatch(fetchRooms(activeFilters));
  }, [dispatch]);

  const handleFilter = (params) => {
    setActiveFilters(params);
    dispatch(fetchRooms(params));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">All Rooms</h1>
          <p className="text-sm text-slate-500 mt-1">
            {pagination ? `${pagination.total} room${pagination.total !== 1 ? "s" : ""} total` : "Manage hostel rooms"}
          </p>
        </div>
        <button onClick={() => { setEditRoom(null); setShowModal(true); }} className="btn-primary">
          <PlusCircle className="w-4 h-4" />
          Add Room
        </button>
      </div>

      {/* Filters */}
      <RoomFilters onFilter={handleFilter} />

      {/* Room Grid */}
      {loading ? (
        <LoadingSpinner text="Loading rooms..." />
      ) : rooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rooms.map((room) => (
            <RoomCard
              key={room._id}
              room={room}
              onEdit={(r) => { setEditRoom(r); setShowModal(true); }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Building2}
          title="No rooms found"
          description="Try adjusting your filters or add a new room."
          action={
            <button onClick={() => { setEditRoom(null); setShowModal(true); }} className="btn-primary">
              <PlusCircle className="w-4 h-4" />
              Add Room
            </button>
          }
        />
      )}

      <AddEditRoomModal
        isOpen={showModal}
        room={editRoom}
        onClose={() => { setShowModal(false); setEditRoom(null); }}
      />
    </div>
  );
}
