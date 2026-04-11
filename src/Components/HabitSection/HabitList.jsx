import { useHabits } from "../../context/HabitContext";

export default function HabitList() {
  const {
    habits,
    editIndex,
    editInput,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleEditInputChange,
    handleDeleteClick,
    toggleDayMark,
    visibleWeekDates
  } = useHabits();

  if (habits.length === 0) {
    return (
      <div>
        <p>
          Looks like you haven't added any habits yet! Let's get started on
          creating some positive ones!
        </p>
      </div>);

  }

  return (
    <>
      {habits.map((habit, index) =>
      <div
        key={index}>


          <div>
            {editIndex === index ?
          <input
            value={editInput}
            onChange={handleEditInputChange}
            type="text" /> :


          <p>{habit.name}</p>}

          </div>

          {visibleWeekDates.map((_, dayIndex) =>
        <div
          key={dayIndex}

          onClick={() => toggleDayMark(index, dayIndex)}>

              <div>



          </div>
            </div>
        )}

          {editIndex === index ?
        <>
              <button

            onClick={handleSaveClick}>

                Save
              </button>
              <button

            onClick={handleCancelClick}>

                Cancel
              </button>
            </> :

        <>
              <button

            onClick={() => handleEditClick(index)}>

                Edit
              </button>
              <button

            onClick={() => handleDeleteClick(index)}>

                Delete
              </button>
            </>}


          <div>
            {`${Math.round(
            habit.days.filter((day) => day).length / 7 * 100
          )}%`}
          </div>
        </div>
      )}
    </>);

}
