import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Building2, CheckSquare, XSquare, Wind, Droplets, PlusCircle, Zap } from "lucide-react";
import { fetchStats, fetchRooms } from "../store/slices/roomSlice";
import StatCard from "../components/common/StatCard";
import RoomCard from "../components/rooms/RoomCard";
import { useState } from "react";
import AddEditRoomModal from "../components/rooms/AddEditRoomModal";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats, statsLoading, rooms, loading } = useSelector((s) => s.rooms);
  const [editRoom, setEditRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchRooms({ limit: 6, isAllocated: "false" }));
  }, [dispatch]);

  const recentRooms = rooms.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of hostel room allocation</p>
        </div>
        <div className="flex gap-2">
          <Link to="/allocate" className="btn-primary">
            <Zap className="w-4 h-4" />
            Allocate Room
          </Link>
          <button onClick={() => { setEditRoom(null); setShowModal(true); }} className="btn-secondary">
            <PlusCircle className="w-4 h-4" />
            Add Room
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard icon={Building2} label="Total Rooms" value={stats?.total} color="blue" loading={statsLoading} />
        <StatCard icon={CheckSquare} label="Available" value={stats?.available} color="green" loading={statsLoading} />
        <StatCard icon={XSquare} label="Occupied" value={stats?.allocated} color="red" loading={statsLoading} />
        <StatCard icon={Wind} label="With AC" value={stats?.withAC} color="purple" loading={statsLoading} />
        <StatCard icon={Droplets} label="Attached WC" value={stats?.withWashroom} color="teal" loading={statsLoading} />
      </div>

      {/* Occupancy Bar */}
      {stats && stats.total > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-700 text-sm">Occupancy Rate</h2>
            <span className="text-sm font-bold text-slate-800">
              {Math.round((stats.allocated / stats.total) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${(stats.allocated / stats.total) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>{stats.allocated} occupied</span>
            <span>{stats.available} available</span>
          </div>
        </div>
      )}

      {/* Recent Available Rooms */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800">Available Rooms</h2>
          <Link to="/rooms" className="text-sm text-blue-600 hover:underline">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse space-y-3">
                <div className="h-5 bg-slate-200 rounded w-1/2" />
                <div className="grid grid-cols-3 gap-2">
                  {[1,2,3].map((j) => <div key={j} className="h-16 bg-slate-100 rounded-lg" />)}
                </div>
              </div>
            ))}
          </div>
        ) : recentRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentRooms.map((room) => (
              <RoomCard key={room._id} room={room} onEdit={(r) => { setEditRoom(r); setShowModal(true); }} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No available rooms. Add rooms to get started.</p>
            <button onClick={() => { setEditRoom(null); setShowModal(true); }} className="btn-primary mt-4 mx-auto">
              <PlusCircle className="w-4 h-4" />
              Add First Room
            </button>
          </div>
        )}
      </div>

      <AddEditRoomModal
        isOpen={showModal}
        room={editRoom}
        onClose={() => { setShowModal(false); setEditRoom(null); }}
      />
    </div>
  );
}
