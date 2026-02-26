import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Building2 } from "lucide-react";
import { createRoom, updateRoom, clearError } from "../../store/slices/roomSlice";

const defaultForm = { roomNo: "", capacity: "", hasAC: false, hasAttachedWashroom: false };

export default function AddEditRoomModal({ isOpen, room, onClose }) {
  const dispatch = useDispatch();
  const { loading, formError } = useSelector((s) => s.rooms);
  const [form, setForm] = useState(defaultForm);
  const [localErrors, setLocalErrors] = useState({});

  useEffect(() => {
    if (room) {
      setForm({
        roomNo: room.roomNo,
        capacity: String(room.capacity),
        hasAC: room.hasAC,
        hasAttachedWashroom: room.hasAttachedWashroom,
      });
    } else {
      setForm(defaultForm);
    }
    setLocalErrors({});
    dispatch(clearError());
  }, [room, isOpen]);

  const validate = () => {
    const errs = {};
    if (!form.roomNo.trim()) errs.roomNo = "Room number is required";
    if (!form.capacity) errs.capacity = "Capacity is required";
    else if (isNaN(form.capacity) || +form.capacity < 1 || +form.capacity > 20)
      errs.capacity = "Capacity must be between 1 and 20";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setLocalErrors(errs); return; }
    setLocalErrors({});

    const payload = {
      roomNo: form.roomNo.trim(),
      capacity: parseInt(form.capacity),
      hasAC: form.hasAC,
      hasAttachedWashroom: form.hasAttachedWashroom,
    };

    const action = room
      ? dispatch(updateRoom({ id: room._id, data: payload }))
      : dispatch(createRoom(payload));

    const result = await action;
    if (!result.error) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="font-bold text-slate-800 text-lg">
              {room ? "Edit Room" : "Add New Room"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server error */}
        {formError?.message && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
            {formError.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room No */}
          <div>
            <label className="label">Room Number *</label>
            <input
              className={`input ${localErrors.roomNo ? "border-red-400 focus:ring-red-400" : ""}`}
              placeholder="e.g. A101"
              value={form.roomNo}
              onChange={(e) => setForm({ ...form, roomNo: e.target.value })}
            />
            {localErrors.roomNo && <p className="text-xs text-red-500 mt-1">{localErrors.roomNo}</p>}
          </div>

          {/* Capacity */}
          <div>
            <label className="label">Capacity (1–20) *</label>
            <input
              type="number"
              className={`input ${localErrors.capacity ? "border-red-400 focus:ring-red-400" : ""}`}
              placeholder="e.g. 4"
              min={1}
              max={20}
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            />
            {localErrors.capacity && <p className="text-xs text-red-500 mt-1">{localErrors.capacity}</p>}
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "hasAC", label: "Air Conditioning", emoji: "❄️" },
              { key: "hasAttachedWashroom", label: "Attached Washroom", emoji: "🚿" },
            ].map(({ key, label, emoji }) => (
              <button
                key={key}
                type="button"
                onClick={() => setForm({ ...form, [key]: !form[key] })}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${
                  form[key]
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                <span className="text-base">{emoji}</span>
                <div className="text-left leading-tight">
                  <div>{label}</div>
                  <div className="text-[10px] font-normal mt-0.5">{form[key] ? "Included" : "Not included"}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? "Saving..." : room ? "Update Room" : "Add Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
