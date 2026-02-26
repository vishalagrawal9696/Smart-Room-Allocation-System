import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Building2, ArrowLeft } from "lucide-react";
import { createRoom, clearError } from "../store/slices/roomSlice";
import { useEffect } from "react";

const defaultForm = { roomNo: "", capacity: "", hasAC: false, hasAttachedWashroom: false };

export default function AddRoomPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, formError } = useSelector((s) => s.rooms);
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, []);

  const validate = () => {
    const e = {};
    if (!form.roomNo.trim()) e.roomNo = "Room number is required";
    if (!form.capacity) e.capacity = "Capacity is required";
    else if (isNaN(form.capacity) || +form.capacity < 1 || +form.capacity > 20)
      e.capacity = "Capacity must be between 1 and 20";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    const result = await dispatch(createRoom({
      roomNo: form.roomNo.trim(),
      capacity: parseInt(form.capacity),
      hasAC: form.hasAC,
      hasAttachedWashroom: form.hasAttachedWashroom,
    }));

    if (!result.error) {
      setSuccess(true);
      setForm(defaultForm);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Add New Room</h1>
        <p className="text-sm text-slate-500 mt-1">Fill in the details to register a new hostel room.</p>
      </div>

      <div className="card">
        {/* Success Banner */}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-6 text-sm font-medium flex items-center gap-2">
            ✅ Room added successfully! You can add another one.
          </div>
        )}

        {/* Server Error */}
        {formError?.message && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {formError.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Room Number *</label>
              <input
                className={`input ${errors.roomNo ? "border-red-400" : ""}`}
                placeholder="e.g. A101, B-204"
                value={form.roomNo}
                onChange={(e) => setForm({ ...form, roomNo: e.target.value })}
              />
              {errors.roomNo && <p className="text-xs text-red-500 mt-1">{errors.roomNo}</p>}
            </div>
            <div>
              <label className="label">Capacity (1–20) *</label>
              <input
                type="number"
                className={`input ${errors.capacity ? "border-red-400" : ""}`}
                placeholder="Maximum students"
                min={1}
                max={20}
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
              {errors.capacity && <p className="text-xs text-red-500 mt-1">{errors.capacity}</p>}
            </div>
          </div>

          <div>
            <label className="label">Facilities</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "hasAC", label: "Air Conditioning", desc: "Room has air conditioning", emoji: "❄️" },
                { key: "hasAttachedWashroom", label: "Attached Washroom", desc: "Private washroom in room", emoji: "🚿" },
              ].map(({ key, label, desc, emoji }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm({ ...form, [key]: !form[key] })}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                    form[key]
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <div className={`text-sm font-semibold ${form[key] ? "text-blue-700" : "text-slate-700"}`}>{label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                  </div>
                  <div className="ml-auto">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form[key] ? "border-blue-500 bg-blue-500" : "border-slate-300"}`}>
                      {form[key] && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 space-y-1">
            <p className="font-medium text-slate-700 mb-2">Room Summary</p>
            <p>🏠 Room <strong>{form.roomNo || "—"}</strong> · Capacity: <strong>{form.capacity || "—"}</strong></p>
            <p>{form.hasAC ? "✅ Air Conditioning" : "❌ No AC"} · {form.hasAttachedWashroom ? "✅ Attached Washroom" : "❌ Shared Washroom"}</p>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate("/rooms")} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  Add Room
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
