import * as api from "../../api/rest";
import { deleteTrackFromPlaylist } from "../playlists/actions";
import { authenticatedRequest } from "../auth/actions";
import { sendMessage } from "../messages/actions";

export const ADD_TRACK = "ADD_TRACK";
export const UPDATE_TRACK = "UPDATE_TRACK";
export const DELETE_TRACK = "DELETE_TRACK";
export const SET_TRACKS = "SET_TRACKS";
export const START_TRACK_FETCHING = "START_TRACK_FETCHING";

export const startTrackFetching = () => ({
  type: START_TRACK_FETCHING,
});

export const setTracks = (tracks) => ({
  type: SET_TRACKS,
  payload: tracks,
});

export const addTrackToStore = (track) => ({
  type: ADD_TRACK,
  payload: track,
});

export const updateTrackInStore = (track) => ({
  type: UPDATE_TRACK,
  payload: track,
});

export const deleteTrackFromStore = (id) => ({
  type: DELETE_TRACK,
  payload: { id },
});

export const fetchTracks = () => {
  return (dispatch) => {
    dispatch(startTrackFetching());
    dispatch(authenticatedRequest(api.tracks.getAll)).then((tracksData) => {
      dispatch(setTracks(tracksData));
    });
  };
};
export default fetchTracks;

export const addTrack = (trackParam) => {
  return async (dispatch) => {
    dispatch(startTrackFetching());
    const track = await dispatch(authenticatedRequest(api.tracks.create, trackParam));
    sendMessage(`Track created (${track.artist}: ${track.title})`);
    dispatch(addTrackToStore(track));
  };
};

export const updateTrack = (trackParam) => {
  return async (dispatch) => {
    dispatch(startTrackFetching());
    const track = await dispatch(authenticatedRequest(api.tracks.update, trackParam));
    sendMessage(`Track modified (${track.artist}: ${track.title})`);
    dispatch(updateTrackInStore(track));
  };
};

export const deleteTrack = (id) => {
  return async (dispatch) => {
    dispatch(startTrackFetching());
    const track = await dispatch(authenticatedRequest(api.tracks.delete, id));
    sendMessage(`Track deleted (${track.artist}: ${track.title})`);
    dispatch(deleteTrackFromStore(id));
    dispatch(deleteTrackFromPlaylist(id));
  };
};
