import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import DateTimePicker from "react-datetime-picker";

import moment from "moment";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { uiCloseModal } from "../../actions/ui";
import {
  eventStartAddNew,
  eventClearActiveEvent,
  eventStartUpdate,
} from "../../actions/events";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
Modal.setAppElement("#root");

const now = moment().minutes(0).seconds(0).add(1, "hours");

const fin = now.clone().add(1, "hours");

const initialEvent = {
  title: "",
  notes: "",
  start: now.toDate(),
  end: fin.toDate(),
};

export const CalendarModal = () => {
  const [dateStart, setDateStart] = useState(now.toDate());
  const [endStart, setDateEnd] = useState(fin.toDate());
  const [titleValid, setTitleValid] = useState(true);
  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState(initialEvent);
  //
  const { modalOpen } = useSelector((state) => state.ui);
  //
  const { activeEvent } = useSelector((state) => state.calendar);
  //para mostrar los datos de las fechas y los inputs con su valor de la nota
  useEffect(() => {
    if (activeEvent) {
      setFormValues(activeEvent);
    } else {
      setFormValues(initialEvent);
    }
  }, [activeEvent, setFormValues]);

  //hasta aqui

  const { notes, title, start, end } = formValues;
  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };
  //   const [isOpen, setIsOpen] = useState(true);
  const closeModal = () => {
    //todo cerrar el modal
    //setIsOpen(false);
    dispatch(uiCloseModal());
    dispatch(eventClearActiveEvent());
    setFormValues(initialEvent);
  };
  const handleStartDateChange = (e) => {
    setDateStart(e);
    console.log(e);
    setFormValues({
      ...formValues,
      start: e,
    });
  };
  const handleEndDateChange = (e) => {
    setDateEnd(e);
    console.log(e);
    setFormValues({
      ...formValues,
      end: e,
    });
  };
  const handleSubmitForm = (e) => {
    e.preventDefault();
    //console.log(formValues);
    const momentStart = moment(start);
    const momendEnd = moment(end);
    if (momentStart.isSameOrAfter(momendEnd)) {
      return Swal.fire(
        "Error",
        "La fecha fin debe de ser mayor a la fecha de incio",
        "error"
      );
    }

    if (title.trim().length < 2) {
      return setTitleValid(false);
    }

    if (activeEvent) {
      dispatch(eventStartUpdate(formValues));
    } else {
      //todo realizar grabacion en base de datos
      dispatch(eventStartAddNew(formValues));
    }

    setTitleValid(true);
    closeModal();
  };
  return (
    <Modal
      isOpen={modalOpen}
      //   onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      closeTimeoutMS={200}
      className="modal"
      overlayClassName="modal-fondo"
    >
      <h1>{activeEvent ? "Editar Evento" : "Nuevo evento"}</h1>
      <hr />
      <form className="container" onSubmit={handleSubmitForm}>
        <div className="form-group">
          <label>Fecha y hora inicio</label>
          <DateTimePicker
            onChange={handleStartDateChange}
            value={dateStart}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Fecha y hora fin</label>
          <DateTimePicker
            onChange={handleEndDateChange}
            value={endStart}
            minDate={dateStart}
            className="form-control"
          />
        </div>

        <hr />
        <div className="form-group">
          <label>Titulo y notas</label>
          <input
            type="text"
            className={`form-control ${!titleValid && "is-invalid"}`}
            placeholder="Título del evento"
            name="title"
            value={title}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <small id="emailHelp" className="form-text text-muted">
            Una descripción corta
          </small>
        </div>

        <div className="form-group">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"
            value={notes}
            onChange={handleInputChange}
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">
            Información adicional
          </small>
        </div>

        <button type="submit" className="btn btn-outline-primary btn-block">
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>
      </form>
    </Modal>
  );
};
