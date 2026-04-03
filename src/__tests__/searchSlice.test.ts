import searchReducer, {
  setQuery,
  resetSearch,
  fetchResults,
} from "../store/slices/searchSlice";
import { SearchState } from "../types";
import { makeTrack, makeAlbum, makeArtist } from "./testUtils";

const initialState: SearchState = {
  query: "",
  results: [],
  totalResults: 0,
  status: "idle",
  error: null,
  page: 0,
  hasMore: false,
};

const fulfilledPayload = (overrides = {}) => ({
  results: [makeTrack()],
  totalResults: 30,
  resultCount: 10,
  append: false,
  ...overrides,
});

describe("searchSlice reducers", () => {
  it("returns initial state for unknown action", () => {
    expect(searchReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  describe("setQuery", () => {
    it("updates the query string", () => {
      const state = searchReducer(initialState, setQuery("coldplay"));
      expect(state.query).toBe("coldplay");
    });
  });

  describe("resetSearch", () => {
    it("clears results, page, status, totalResults and error", () => {
      const populated: SearchState = {
        ...initialState,
        query: "test",
        results: [makeTrack()],
        totalResults: 100,
        status: "succeeded",
        page: 3,
        hasMore: true,
        error: null,
      };
      const state = searchReducer(populated, resetSearch());
      expect(state.results).toEqual([]);
      expect(state.page).toBe(0);
      expect(state.hasMore).toBe(false);
      expect(state.status).toBe("idle");
      expect(state.totalResults).toBe(0);
      expect(state.error).toBeNull();
    });
  });

  it("preserves the query string so setQuery can update it separately", () => {
    const state = searchReducer(
      { ...initialState, query: "coldplay" },
      resetSearch(),
    );
    expect(state.query).toBe("coldplay");
  });
});

describe("fetchResults async thunk", () => {
  describe("pending", () => {
    it("sets status to loading and clears previous error", () => {
      const state = searchReducer(
        { ...initialState, status: "failed", error: "old error" },
        fetchResults.pending("", { term: "test", offset: 0 }),
      );
      expect(state.status).toBe("loading");
      expect(state.error).toBeNull();
    });
  });

  describe("rejected", () => {
    it("sets status to failed with the error message", () => {
      const action = fetchResults.rejected(
        new Error("Network error"),
        "",
        { term: "test", offset: 0 },
        "Network error",
      );
      const state = searchReducer(initialState, action);
      expect(state.status).toBe("failed");
      expect(state.error).toBe("Network error");
    });

    it('falls back to "Unknown error" when no payload', () => {
      const action = fetchResults.rejected(
        new Error(),
        "",
        { term: "test", offset: 0 },
        undefined,
      );
      const state = searchReducer(initialState, action);
      expect(state.error).toBe("Unknown error");
    });
  });

  describe("fulfilled — first page (append: false)", () => {
    it("replaces results and sets status to succeeded", () => {
      const payload = fulfilledPayload({
        results: [makeTrack(), makeAlbum()],
        totalResults: 50,
      });
      const action = fetchResults.fulfilled(payload, "", {
        term: "test",
        offset: 0,
      });
      const state = searchReducer(initialState, action);
      expect(state.status).toBe("succeeded");
      expect(state.results).toHaveLength(2);
      expect(state.page).toBe(1);
    });

    it("sets hasMore true when results.length < totalResults", () => {
      const payload = fulfilledPayload({
        results: [makeTrack()],
        totalResults: 30,
      });
      const action = fetchResults.fulfilled(payload, "", {
        term: "test",
        offset: 0,
      });
      const state = searchReducer(initialState, action);
      expect(state.hasMore).toBe(true);
    });

    it("sets hasMore false when all results are loaded", () => {
      const payload = fulfilledPayload({
        results: [makeTrack()],
        totalResults: 1,
      });
      const action = fetchResults.fulfilled(payload, "", {
        term: "test",
        offset: 0,
      });
      const state = searchReducer(initialState, action);
      expect(state.hasMore).toBe(false);
    });

    it("stores totalResults in state", () => {
      const payload = fulfilledPayload({ totalResults: 87 });
      const action = fetchResults.fulfilled(payload, "", {
        term: "test",
        offset: 0,
      });
      const state = searchReducer(initialState, action);
      expect(state.totalResults).toBe(87);
    });

    it("clears error on success", () => {
      const stateWithError = {
        ...initialState,
        error: "previous error",
        status: "failed" as const,
      };
      const payload = fulfilledPayload();
      const action = fetchResults.fulfilled(payload, "", {
        term: "test",
        offset: 0,
      });
      const state = searchReducer(stateWithError, action);
      expect(state.error).toBeNull();
    });
  });

  describe("fulfilled — pagination (append: true)", () => {
    const existingTrack = makeTrack({ trackId: 1 });
    const stateWithResults: SearchState = {
      ...initialState,
      results: [existingTrack],
      totalResults: 40,
      status: "succeeded",
      page: 1,
      hasMore: true,
    };

    it("appends new unique results", () => {
      const newTrack = makeTrack({ trackId: 2 });
      const payload = fulfilledPayload({
        results: [newTrack],
        totalResults: 40,
        append: true,
      });
      const action = fetchResults.fulfilled(payload, "", {
        term: "test",
        offset: 10,
        append: true,
      });
      const state = searchReducer(stateWithResults, action);
      expect(state.results).toHaveLength(2);
      expect(state.results[1].trackId).toBe(2);
    });

    it("deduplicates tracks that are already in results", () => {
      const duplicate = makeTrack({ trackId: 1 }); // same id as existing
      const payload = fulfilledPayload({
        results: [duplicate],
        totalResults: 40,
        append: true,
      });
      const action = fetchResults.fulfilled(payload, "", {
        term: "test",
        offset: 10,
        append: true,
      });
      const state = searchReducer(stateWithResults, action);
      expect(state.results).toHaveLength(1);
    });

    it("increments the page counter", () => {
      const payload = fulfilledPayload({
        results: [makeTrack({ trackId: 99 })],
        totalResults: 40,
        append: true,
      });
      const action = fetchResults.fulfilled(payload, "", {
        term: "test",
        offset: 10,
        append: true,
      });
      const state = searchReducer(stateWithResults, action);
      expect(state.page).toBe(2);
    });

    it("sets hasMore false when accumulated results reach total", () => {
      const newTracks = [makeTrack({ trackId: 2 }), makeTrack({ trackId: 3 })];
      // After append: 1 existing + 2 new = 3 results, totalResults=3 → hasMore=false
      const payload = fulfilledPayload({
        results: newTracks,
        totalResults: 3,
        append: true,
      });
      const action = fetchResults.fulfilled(payload, "", {
        term: "test",
        offset: 10,
        append: true,
      });
      const state = searchReducer(stateWithResults, action);
      expect(state.hasMore).toBe(false);
    });
  });

  describe("deduplication — albums and artists", () => {
    it("deduplicates albums by collectionId", () => {
      const stateWithAlbum: SearchState = {
        ...initialState,
        results: [makeAlbum({ collectionId: 200 })],
        totalResults: 20,
        page: 1,
        hasMore: true,
        status: "succeeded",
      };
      const payload = fulfilledPayload({
        results: [makeAlbum({ collectionId: 200 })],
        totalResults: 20,
        append: true,
      });
      const action = fetchResults.fulfilled(payload, "", {
        term: "test",
        offset: 10,
        append: true,
      });
      const state = searchReducer(stateWithAlbum, action);
      expect(state.results).toHaveLength(1);
    });

    it("deduplicates artists by artistId", () => {
      const stateWithArtist: SearchState = {
        ...initialState,
        results: [makeArtist({ artistId: 101 })],
        totalResults: 20,
        page: 1,
        hasMore: true,
        status: "succeeded",
      };
      const payload = fulfilledPayload({
        results: [makeArtist({ artistId: 101 })],
        totalResults: 20,
        append: true,
      });
      const action = fetchResults.fulfilled(payload, "", {
        term: "test",
        offset: 10,
        append: true,
      });
      const state = searchReducer(stateWithArtist, action);
      expect(state.results).toHaveLength(1);
    });

    it("does NOT deduplicate items with different ids", () => {
      const stateWithTrack: SearchState = {
        ...initialState,
        results: [makeTrack({ trackId: 1 })],
        totalResults: 20,
        page: 1,
        hasMore: true,
        status: "succeeded",
      };
      const payload = fulfilledPayload({
        results: [makeTrack({ trackId: 2 })],
        totalResults: 20,
        append: true,
      });
      const action = fetchResults.fulfilled(payload, "", {
        term: "test",
        offset: 10,
        append: true,
      });
      const state = searchReducer(stateWithTrack, action);
      expect(state.results).toHaveLength(2);
    });
  });
});
