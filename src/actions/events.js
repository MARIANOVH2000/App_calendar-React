import Swal from "sweetalert2";
import { fetchConToken } from "../helpers/fetch";
import { prepareEvents } from "../helpers/prepareEvents";
import { types } from "../types/types";
//cre<AR UNA NUEVA NOTA
export const eventStartAddNew = (event) => {
  return async (dispatch, getState) => {
    const { uid, name } = getState().auth;
    try {
      const res = await fetchConToken("events", event, "POST");
      const body = await res.json();
      console.log(body);
      if (body.ok) {
        event.id = body.evento.id;
        event.user = {
          _id: uid,
          name: name,
        };
        console.log(event);
        dispatch(eventAddNew(event));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

const eventAddNew = (event) => ({
  type: types.eventAddNew,
  payload: event,
});
export const eventSetActive = (event) => ({
  type: types.eventSetActive,
  payload: event,
});

export const eventClearActiveEvent = () => ({
  type: types.eventClearActiveEvent,
});
//ACTUALIZAR LAS NOTAS
export const eventStartUpdate = (event) => {
  return async (dispatch) => {
    try {
      const resp = await fetchConToken(`events/${event.id}`, event, "PUT");
      const body = await resp.json();
      if (body.ok) {
        dispatch(eventUpdated(event));
      } else {
        Swal.fire("Error", body.msg, "error");
      }
    } catch (error) {
      console.log(error);
    }
  };
};

const eventUpdated = (event) => ({
  type: types.eventUpdated,
  payload: event,
});
//eliminaAR notas
export const eventStartDelete = (event) => {
  return async (dispatch, getState) => {
    const { id } = getState().calendar.activeEvent;
    try {
      const resp = await fetchConToken(`events/${id}`, {}, "DELETE");
      const body = await resp.json();
      if (body.ok) {
        dispatch(eventDeleted());
      } else {
        Swal.fire("Error", body.msg, "error");
      }
    } catch (error) {
      console.log(error);
    }
  };
};

const eventDeleted = () => ({
  type: types.eventDeleted,
});
//cargar las notas
export const eventStartLoading = () => {
  return async (dispatch) => {
    try {
      const resp = await fetchConToken("events");
      const body = await resp.json();
      //CONTROLAR LAS FECHAS Y PASARLO AL CALENDARIO
      //CONVERTIR LAS las fechas de string a tipo date
      const events = prepareEvents(body.eventos);
      console.log(events);
      dispatch(eventLoaded(events));
    } catch (error) {
      console.log(error);
    }
  };
};
const eventLoaded = (events) => ({
  type: types.eventLoaded,
  payload: events,
});
//limpiar del storage
export const eventLogout=()=>({type:types.eventLogout});
