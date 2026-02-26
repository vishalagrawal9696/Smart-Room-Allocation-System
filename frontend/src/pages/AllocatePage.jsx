import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRooms, clearAllocationResult } from "../store/slices/roomSlice";
import AllocationForm from "../components/allocation/AllocationForm";
import RoomCard from "../components/rooms/RoomCard";
import RoomFilters from "../components/rooms/RoomFilters";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import AddEditRoomModal from "../components/rooms/AddEditRoomModal";
import { Building2, Search, Zap } from "lucide-react";
import { useState as useEditState } from "react";

export default function AllocatePage() {
  const dispatch = useDispatch();
  const { rooms, loading, pagination } = useSelector((s) => s.rooms);
  const [activeTab, setActiveTab] = useState("allocate");
  const [editRoom, setEditRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(clearAllocationResult());
    dispatch(fetchRooms({ isAllocated: "false" }));
  }, [dispatch]);

  const handleFilter = (params) => {
    dispatch(fetchRooms(params));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Search & Allocate</h1>
        <p className="text-sm text-slate-500 mt-1">Search for rooms or automatically allocate the best match</p>
      </div>

      {/* Tab Switch */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {[
          { id: "allocate", label: "Auto Allocate", icon: Zap },
          { id: "search", label: "Search Rooms", icon: Search },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "allocate" ? (
        <div className="max-w-lg">
          <AllocationForm />
        </div>
      ) : (
        <div className="space-y-5">
          <RoomFilters onFilter={handleFilter} />

          {loading ? (
            <LoadingSpinner text="Searching rooms..." />
          ) : rooms.length > 0 ? (
            <>
              <p className="text-sm text-slate-500">{pagination?.total ?? rooms.length} room{rooms.length !== 1 ? "s" : ""} found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {rooms.map((room) => (
                  <RoomCard key={room._id} room={room} onEdit={(r) => { setEditRoom(r); setShowModal(true); }} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={Building2}
              title="No rooms match your search"
              description="Try different filter criteria."
            />
          )}
        </div>
      )}

      <AddEditRoomModal
        isOpen={showModal}
        room={editRoom}
        onClose={() => { setShowModal(false); setEditRoom(null); }}
      />
    </div>
  );
}
