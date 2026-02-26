import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allocateRoom, clearAllocationResult } from "../../store/slices/roomSlice";
import { CheckCircle, XCircle, Zap, Wind, Droplets, Users, Building2 } from "lucide-react";

const defaultForm = { students: "", needsAC: false, needsWashroom: false, groupName: "" };

export default function AllocationForm() {
  const dispatch = useDispatch();
  const { allocationLoading, allocationResult } = useSelector((s) => s.rooms);
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.students) e.students = "Number of students is required";
    else if (isNaN(form.students) || +form.students < 1) e.students = "Must be at least 1";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    dispatch(clearAllocationResult());
    dispatch(allocateRoom({
      students: parseInt(form.students),
      needsAC: form.needsAC,
      needsWashroom: form.needsWashroom,
      groupName: form.groupName.trim() || undefined,
    }));
  };

  const result = allocationResult;
  const allocated = result?.data?.allocated;
  const room = result?.data?.room;

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="card">
        <h2 className="font-bold text-slate-800 text-base mb-5 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          Allocate Room
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Number of Students *</label>
            <input
              type="number"
              className={`input ${errors.students ? "border-red-400" : ""}`}
              placeholder="e.g. 3"
              min={1}
              value={form.students}
              onChange={(e) => setForm({ ...form, students: e.target.value })}
            />
            {errors.students && <p className="text-xs text-red-500 mt-1">{errors.students}</p>}
          </div>

          <div>
            <label className="label">Group Name (optional)</label>
            <input
              className="input"
              placeholder="e.g. Batch A - Computer Science"
              value={form.groupName}
              onChange={(e) => setForm({ ...form, groupName: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Facility Requirements</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "needsAC", label: "Air Conditioning", icon: Wind, emoji: "❄️" },
                { key: "needsWashroom", label: "Attached Washroom", icon: Droplets, emoji: "🚿" },
              ].map(({ key, label, emoji }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm({ ...form, [key]: !form[key] })}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    form[key]
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <span className="text-xl">{emoji}</span>
                  <div className="text-left">
                    <div className="text-sm">{label}</div>
                    <div className="text-[11px] font-normal">{form[key] ? "Required" : "Not required"}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={allocationLoading} className="btn-primary w-full justify-center py-2.5">
            {allocationLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Finding Best Room...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Find & Allocate Room
              </>
            )}
          </button>
        </form>
      </div>

      {/* Output Panel */}
      {result && (
        <div className={`card border-2 ${allocated ? "border-emerald-200 bg-emerald-50/40" : "border-red-200 bg-red-50/40"}`}>
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            {allocated ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            Allocation Result
          </h3>

          {allocated ? (
            <div className="space-y-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700`}>
                Room Allocated Successfully!
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Room Details</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Room No.</span>
                      <span className="font-bold text-slate-800">{room.roomNo}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Capacity</span>
                      <span className="font-medium text-slate-700">{room.capacity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Allocated to</span>
                      <span className="font-medium text-slate-700">{room.allocatedStudents} student{room.allocatedStudents !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Facilities</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Wind className={`w-4 h-4 ${room.hasAC ? "text-blue-500" : "text-slate-300"}`} />
                      <span className={room.hasAC ? "text-blue-700" : "text-slate-400"}>
                        AC {room.hasAC ? "✓" : "✗"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Droplets className={`w-4 h-4 ${room.hasAttachedWashroom ? "text-teal-500" : "text-slate-300"}`} />
                      <span className={room.hasAttachedWashroom ? "text-teal-700" : "text-slate-400"}>
                        Washroom {room.hasAttachedWashroom ? "✓" : "✗"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {room.allocatedTo && (
                <p className="text-sm text-slate-600">
                  Assigned to: <span className="font-medium">{room.allocatedTo}</span>
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-red-600 font-semibold mb-2">No Room Available</p>
              <p className="text-sm text-slate-500">
                No unallocated room matches your requirements for <strong>{form.students} student{+form.students !== 1 ? "s" : ""}</strong>
                {form.needsAC ? ", with AC" : ""}
                {form.needsWashroom ? ", with attached washroom" : ""}.
              </p>
              <p className="text-xs text-slate-400 mt-2">Try adjusting the requirements or add more rooms.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
