import { useTimeTracker } from "../../context/TimeTrackerContext";

function TimerCircle() {
  const {
    totalSeconds,
    isEditing,
    editTime,
    setEditTime,
    handleUpdateTime,
    radius,
    circumference,
    strokeDashoffset
  } = useTimeTracker();

  return (
    <div>
      <svg width="400" height="400" viewBox="0 0 200 200">
        <circle
          stroke="#424874"
          cx="100"
          cy="100"
          r={radius}
          strokeWidth="5"
          fill="transparent" />

        <circle

          stroke="#FFD1D1"
          cx="100"
          cy="100"
          r={radius}
          strokeWidth="9"
          fill="transparent" />






        {isEditing ?
        <>
            <foreignObject x="70" y="90" width="100" height="50">
              <input
              type="text"
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}

              placeholder="Enter minutes" />


            </foreignObject>
            <foreignObject x="140" y="89" width="100" height="30">
              <button onClick={handleUpdateTime}>
                Save
              </button>
            </foreignObject>
          </> :

        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="20">


            {`${Math.floor(totalSeconds / 60)}:${
          totalSeconds % 60 < 10 ? "0" : ""
          }${totalSeconds % 60}`}
          </text>}

      </svg>
    </div>);

}

export default TimerCircle;
