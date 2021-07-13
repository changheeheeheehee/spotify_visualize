import { ResponsiveChoroplethCanvas, ResponsiveChoropleth } from "@nivo/geo";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { mapdata } from "./data";
import { features } from "./features";
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
function MyResponsiveChoroplethCanvas({ data /* see data tab */ }) {
  // const [datas, setDatas] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchDatas = async () => {
  //     try {
  //       // 요청이 시작 할 때에는 error 와 users 를 초기화하고
  //       setError(null);
  //       setDatas(null);
  //       // loading 상태를 true 로 바꿉니다.
  //       setLoading(true);
  //       const response = await axios.get("http://localhost:5000/region_chart");
  //       setDatas(response.data); // 데이터는 response.data 안에 들어있습니다.
  //     } catch (e) {
  //       setError(e);
  //     }
  //     setLoading(false);
  //   };

  //   fetchDatas();
  // }, []);

  const country = (data) => {
    console.log(data);
  };

  // if (loading) return <div>로딩중..</div>;
  // if (error) return <div>에러가 발생했습니다</div>;
  // if (!datas) return null;
  // console.log(datas);
  return (
    <ResponsiveChoropleth
      data={data}
      features={features["features"]}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      colors="nivo"
      domain={[0, data[1]["value"]]}
      unknownColor="#666666"
      label="properties.name"
      valueFormat=".2s"
      projectionType="naturalEarth1"
      projectionScale={120}
      projectionTranslation={[0.5, 0.5]}
      projectionRotation={[0, 0, 0]}
      enableGraticule={true}
      graticuleLineColor="#dddddd"
      borderWidth={2}
      borderColor="#152538"
      onClick={country}
      legends={[
        {
          anchor: "bottom-left",
          direction: "column",
          justify: true,
          translateX: 20,
          translateY: -100,
          itemsSpacing: 0,
          itemWidth: 94,
          itemHeight: 18,
          itemDirection: "left-to-right",
          itemTextColor: "#444444",
          itemOpacity: 0.85,
          symbolSize: 18,
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000000",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
}

export default MyResponsiveChoroplethCanvas;
