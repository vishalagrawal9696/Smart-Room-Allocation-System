import { Wind, Droplets, Users, Trash2, Edit, Unlock } from "lucide-react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { deleteRoom, deallocateRoom } from "../../store/slices/roomSlice";
import ConfirmModal from "../common/ConfirmModal";

export default function RoomCard({ room, onEdit }) {
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    setDeleteLoading(true);
    await dispatch(deleteRoom(room._id));
    setDeleteLoading(false);
    setShowDeleteModal(false);
  };

  const handleDeallocate = () => {
    dispatch(deallocateRoom(room._id));
  };

  return (
    <>
      <div className="card flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-lg leading-tight">Room {room.roomNo}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Added {new Date(room.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span className={room.isAllocated ? "badge-red" : "badge-green"}>
            <span className={`w-1.5 h-1.5 rounded-full ${room.isAllocated ? "bg-red-500" : "bg-emerald-500"}`} />
            {room.isAllocated ? "Occupied" : "Available"}
          </span>
        </div>

        {/* Facilities */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 rounded-lg">
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700">{room.capacity}</span>
            <span className="text-[10px] text-slate-400">Capacity</span>
          </div>
          <div className={`flex flex-col items-center gap-1 p-2 rounded-lg ${room.hasAC ? "bg-blue-50" : "bg-slate-50"}`}>
            <Wind className={`w-4 h-4 ${room.hasAC ? "text-blue-500" : "text-slate-300"}`} />
            <span className={`text-xs font-semibold ${room.hasAC ? "text-blue-700" : "text-slate-400"}`}>
              {room.hasAC ? "Yes" : "No"}
            </span>
            <span className="text-[10px] text-slate-400">AC</span>
          </div>
          <div className={`flex flex-col items-center gap-1 p-2 rounded-lg ${room.hasAttachedWashroom ? "bg-teal-50" : "bg-slate-50"}`}>
            <Droplets className={`w-4 h-4 ${room.hasAttachedWashroom ? "text-teal-500" : "text-slate-300"}`} />
            <span className={`text-xs font-semibold ${room.hasAttachedWashroom ? "text-teal-700" : "text-slate-400"}`}>
              {room.hasAttachedWashroom ? "Yes" : "No"}
            </span>
            <span className="text-[10px] text-slate-400">Washroom</span>
          </div>
        </div>

        {/* Allocation Info */}
        {room.isAllocated && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-700">
            <span className="font-medium">{room.allocatedTo}</span>
            {" • "}
            {room.allocatedStudents} student{room.allocatedStudents !== 1 ? "s" : ""}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1 border-t border-slate-50">
          {room.isAllocated ? (
            <button onClick={handleDeallocate} className="btn-secondary flex-1 text-xs py-1.5">
              <Unlock className="w-3.5 h-3.5" />
              Deallocate
            </button>
          ) : (
            <>
              <button onClick={() => onEdit(room)} className="btn-secondary flex-1 text-xs py-1.5">
                <Edit className="w-3.5 h-3.5" />
                Edit
              </button>
              <button onClick={() => setShowDeleteModal(true)} className="btn-danger flex-1 text-xs py-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Room"
        message={`Are you sure you want to delete Room ${room.roomNo}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleteLoading}
      />
    </>
  );
}
