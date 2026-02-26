import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { roomAPI } from "../../api/roomService";
import toast from "react-hot-toast";

// ── Async Thunks ──────────────────────────────────────────────────────────────

export const fetchRooms = createAsyncThunk(
  "rooms/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await roomAPI.getAll(params);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch rooms");
    }
  }
);

export const fetchStats = createAsyncThunk("rooms/fetchStats", async (_, { rejectWithValue }) => {
  try {
    const res = await roomAPI.getStats();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch stats");
  }
});

export const createRoom = createAsyncThunk(
  "rooms/create",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const res = await roomAPI.create(data);
      toast.success(res.data.message);
      dispatch(fetchStats());
      return res.data.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add room";
      return rejectWithValue({ message, errors: err.response?.data?.errors });
    }
  }
);

export const updateRoom = createAsyncThunk(
  "rooms/update",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const res = await roomAPI.update(id, data);
      toast.success(res.data.message);
      dispatch(fetchStats());
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update room");
    }
  }
);

export const deleteRoom = createAsyncThunk(
  "rooms/delete",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await roomAPI.delete(id);
      toast.success(res.data.message);
      dispatch(fetchStats());
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete room");
    }
  }
);

export const allocateRoom = createAsyncThunk(
  "rooms/allocate",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const res = await roomAPI.allocate(data);
      if (res.data.data.allocated) {
        toast.success(res.data.message);
        dispatch(fetchStats());
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Allocation failed");
    }
  }
);

export const deallocateRoom = createAsyncThunk(
  "rooms/deallocate",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await roomAPI.deallocate(id);
      toast.success(res.data.message);
      dispatch(fetchStats());
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Deallocation failed");
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  rooms: [],
  pagination: null,
  stats: null,
  allocationResult: null,
  loading: false,
  statsLoading: false,
  allocationLoading: false,
  error: null,
  formError: null,
};

const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; state.formError = null; },
    clearAllocationResult: (state) => { state.allocationResult = null; },
  },
  extraReducers: (builder) => {
    // Fetch Rooms
    builder
      .addCase(fetchRooms.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload.rooms;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Stats
    builder
      .addCase(fetchStats.pending, (state) => { state.statsLoading = true; })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state) => { state.statsLoading = false; });

    // Create Room
    builder
      .addCase(createRoom.pending, (state) => { state.loading = true; state.formError = null; })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms.unshift(action.payload);
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.formError = action.payload;
      });

    // Update Room
    builder
      .addCase(updateRoom.pending, (state) => { state.loading = true; })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.rooms.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) state.rooms[idx] = action.payload;
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Room
    builder
      .addCase(deleteRoom.pending, (state) => { state.loading = true; })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = state.rooms.filter((r) => r._id !== action.payload);
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Allocate Room
    builder
      .addCase(allocateRoom.pending, (state) => { state.allocationLoading = true; state.allocationResult = null; })
      .addCase(allocateRoom.fulfilled, (state, action) => {
        state.allocationLoading = false;
        state.allocationResult = action.payload;
        if (action.payload.data?.allocated && action.payload.data?.room) {
          const idx = state.rooms.findIndex((r) => r._id === action.payload.data.room._id);
          if (idx !== -1) state.rooms[idx] = action.payload.data.room;
        }
      })
      .addCase(allocateRoom.rejected, (state, action) => {
        state.allocationLoading = false;
        state.error = action.payload;
      });

    // Deallocate Room
    builder
      .addCase(deallocateRoom.fulfilled, (state, action) => {
        const idx = state.rooms.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) state.rooms[idx] = action.payload;
      });
  },
});

export const { clearError, clearAllocationResult } = roomSlice.actions;
export default roomSlice.reducer;
