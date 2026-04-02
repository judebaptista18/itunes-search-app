import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  SearchState,
  ItunesResult,
  SearchApiResponse,
  ITEMS_PER_PAGE,
} from "../../types";

//Async thunk for fetching search results from our express backend
export const fetchResults = createAsyncThunk<
  SearchApiResponse & { append: boolean },
  { term: string; offset: number; append?: boolean },
  { rejectValue: string }
>(
  "search/fetchResults",
  async ({ term, offset, append = false }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<SearchApiResponse>("/api/search", {
        params: { term, offset, limit: ITEMS_PER_PAGE },
      });
      return { ...data, append };
    } catch (err: unknown) {
      // Extract error message from API response if available, otherwise use generic message.
      // Use a type-narrowed structural check rather than axios.isAxiosError()
      // so this works correctly whether axios is mocked in tests or not.
      const apiError =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        (err as { response?: { data?: { error?: string } } }).response?.data
          ?.error;
      return rejectWithValue(
        typeof apiError === "string"
          ? apiError
          : "Something went wrong. Please try again.",
      );
    }
  },
);

// Initial state
const initialState: SearchState = {
  query: "",
  results: [],
  totalResults: 0,
  status: "idle",
  error: null,
  page: 0,
  hasMore: false,
};

// slice definition
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    resetSearch(state) {
      state.results = [];
      state.totalResults = 0;
      state.page = 0;
      state.hasMore = false;
      state.status = "idle";
      state.error = null;
    },
  },
  // Handle async thunk lifecycle actions
  extraReducers: (builder) => {
    builder
      .addCase(fetchResults.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        const { results, totalResults, append } = action.payload;
        state.status = "succeeded";
        state.error = null;

        if (append) {
          // Deduplicate by composite key before merging
          const existingIds = new Set(
            state.results.map(
              (r) =>
                `${r.wrapperType}-${r.trackId ?? r.collectionId ?? r.artistId}`,
            ),
          );
          const newUnique = results.filter(
            (r: ItunesResult) =>
              !existingIds.has(
                `${r.wrapperType}-${r.trackId ?? r.collectionId ?? r.artistId}`,
              ),
          );
          state.results = [...state.results, ...newUnique];
        } else {
          state.results = results;
        }

        state.totalResults = totalResults;
        state.page = append ? state.page + 1 : 1;
        state.hasMore = state.results.length < totalResults;
      })
      .addCase(fetchResults.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { setQuery, resetSearch } = searchSlice.actions;
export default searchSlice.reducer;
