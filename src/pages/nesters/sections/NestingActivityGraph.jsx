import React, { useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpeciesVsEggs } from "../../../redux/thunks/nestingEvent.thunk";

const NestingActivityGraph = () => {
  const dispatch = useDispatch();
  const { speciesVsEggs, speciesVsEggsLoading, speciesVsEggsError } = useSelector(
    (state) => state.nestingEvent
  );

  useEffect(() => {
    dispatch(fetchSpeciesVsEggs());
  }, [dispatch]);

  if (speciesVsEggsLoading) {
    return <div className="text-center py-8 text-[#666639]">Loading chart...</div>;
  }
  if (speciesVsEggsError) {
    return <div className="text-center py-8 text-red-500">{speciesVsEggsError}</div>;
  }
  if (!speciesVsEggs || speciesVsEggs.length === 0) {
    return <div className="text-center py-8 text-gray-500">No data available.</div>;
  }

  // Prepare data for nivo
  const data = speciesVsEggs.map((item) => ({
    species: item.species_name,
    eggs: item.num_of_eggs,
    eggsHatched: item.num_of_eggs_hatched,
  }));

  return (
    <div className="h-[300px]">
      <ResponsiveBar
        data={data}
        keys={["eggs", "eggsHatched"]}
        indexBy="species"
        margin={{ top: 10, right: 20, bottom: 40, left: 60 }}
        padding={0.3}
        layout="horizontal"
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={({ id }) => (id === "eggs" ? "#376328" : "#A3C585")}
        borderRadius={4}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Eggs / Eggs Hatched",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        enableGridX={true}
        enableGridY={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#ffffff"
        role="application"
        ariaLabel="Nesting Activity by Species"
        barAriaLabel={e => `${e.indexValue}: ${e.value} ${e.id}`}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 4,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            symbolSize: 16,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        groupMode="grouped" 
      />
    </div>
  );
};

export default NestingActivityGraph;