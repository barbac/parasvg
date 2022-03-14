import { useAppSelector, useAppDispatch } from "../app/hooks";
import { setParameterValue, selectParameters } from "./patternSlice";

export default function Parameters() {
  const parametersList = useAppSelector(selectParameters);
  const dispatch = useAppDispatch();

  const intputFields = parametersList.map(({ name, parameters }, i) => {
    const fields = [];
    for (const key in parameters) {
      fields.push(
        <div key={key}>
          <div>{key}</div>
          <input
            type="number"
            value={parameters[key]}
            onChange={(e) => {
              const value = e.target.valueAsNumber;
              if (!Number.isNaN(value)) {
                dispatch(setParameterValue({ index: i, name: key, value }));
              }
            }}
          />
        </div>
      );
    }

    return (
      <div key={name}>
        {i && <div>---</div>}
        <div style={{ marginBottom: 10 }}>{name}</div>
        <>{fields}</>
      </div>
    );
  });
  return <div className="parameters">{intputFields}</div>;
}
