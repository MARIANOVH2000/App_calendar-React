import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Navbar } from "../ui/Navbar";
import { CalendarEvent } from "./CalendarEvent";
import { messages } from "../../helpers/calendar-messages-es";
import { CalendarModal } from "./CalendarModal";
//idioma de las fechas en español
import "moment/locale/es";
import { useDispatch, useSelector } from "react-redux";
import { uiOpenModal } from "../../actions/ui";
import {
  eventSetActive,
  eventStartLoading,
  eventClearActiveEvent,
} from "../../actions/events";
import { AddNewFab } from "../ui/AddNewFab";
import { DeletedEventFab } from "../ui/DeletedEventFab";
moment.locale("es");

const localizer = momentLocalizer(moment);

// const events = [
//   {
//     title: "Cumpleaños del jefe",
//     start: moment().toDate(),
//     end: moment().add(2, "hours").toDate(),
//     bgcolor: "#fafafa",
//     notes: "Comprar el pastel",
//     user: {
//       _id: "123",
//       name: "Fernando",
//     },
//   },
// ];

export const CalendarScreen = () => {
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { uid } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [lastView, setLastView] = useState(
    localStorage.getItem("lastView") || "month"
  );

  useEffect(() => {
    dispatch(eventStartLoading());
  }, [dispatch]);

  const onDoubleClick = (e) => {
    dispatch(uiOpenModal());
  };
  const onSelectEvent = (e) => {
    dispatch(eventSetActive(e));
  };
  const onViewChange = (e) => {
    setLastView(e);
    localStorage.setItem("lastView", e);
  };
  const onSelectedSlot = (e) => {
    dispatch(eventClearActiveEvent());
  };

  const eventStyleGetter = (event, start, end, isSeleted) => {
    // console.log(event, start, end, isSeleted);
    const style = {
      backgroundColor: (uid === event.user._id) ? "#367cf7" : "#465660",
      borderRadius: "0px",
      opacity: 0.8,
      display: "block",
      color: "white",
    };
    return { style };
  };
  return (
    <div className="calendar-screen">
      <Navbar />

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelectEvent}
        onView={onViewChange}
        view={lastView}
        eventPropGetter={eventStyleGetter}
        components={{ event: CalendarEvent }}
        // {para que se puede hacer nul cuando hago clic en cualquier parte que nose en la nota}
        onSelectSlot={onSelectedSlot}
        selectable={true}
      />
      <AddNewFab />
      {activeEvent && <DeletedEventFab />}
      <CalendarModal />
    </div>
  );
};
