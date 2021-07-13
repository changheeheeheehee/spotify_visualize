import React, { useState, useEffect } from "react";
import axios from "axios";
import MyResponsiveChoroplethCanvas from "./map_chart";
import MyResponsiveBar from "./bar_chart";
import MyResponsiveBar2 from "./barchart2";
import "./App.css";
import MyResponsiveLine from "./line_chart";

function Board2() {
  const [regiondata, setregiondata] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [error1, setError1] = useState(null);
  const [artistdata, setartistdata] = useState(null);
  const [loading2, setLoading2] = useState(false);
  const [error2, setError2] = useState(null);
  const [trackdata, settrackdata] = useState(null);
  const [loading3, setLoading3] = useState(false);
  const [error3, setError3] = useState(null);
  const [datedata, setdatedata] = useState(null);
  const [loading4, setLoading4] = useState(false);
  const [error4, setError4] = useState(null);
  const [region, setregion] = useState(null);
  const [artist, setartist] = useState(null);
  const [track, settrack] = useState(null);
  const [date, setdate] = useState(null);
  useEffect(() => {
    const fetchregiondata = async () => {
      try {
        // 요청이 시작 할 때에는 error 와 users 를 초기화하고
        setError1(null);
        setregiondata(null);
        // loading 상태를 true 로 바꿉니다.
        setLoading1(true);
        const response = await axios.post(
          "http://localhost:5000/total_chart_api",
          {}
        );
        setregiondata(response.data); // 데이터는 response.data 안에 들어있습니다.
      } catch (e) {
        setError1(e);
      }
      setLoading1(false);
    };

    fetchregiondata();
  }, []);

  if (loading1 | loading2 | loading3 | loading4) return <div>로딩중..</div>;
  if (error1 | error2 | error3 | error4) return <div>에러가 발생했습니다</div>;
  if (!regiondata | !artistdata | !trackdata | !datedata) return null;
  console.log(loading1);
  console.log(regiondata);
  return (
    <>
      <div className="container">
        <div className="App">
          <MyResponsiveChoroplethCanvas
            data={regiondata}
          ></MyResponsiveChoroplethCanvas>
        </div>
        <div className="App">
          <MyResponsiveBar data={artistdata} y="artist"></MyResponsiveBar>
        </div>
      </div>
      <div className="container">
        <div className="App">
          <MyResponsiveLine data={datedata}></MyResponsiveLine>
        </div>
        <div className="App">
          <MyResponsiveBar2 data={trackdata} y="artist"></MyResponsiveBar2>
        </div>
      </div>
    </>
  );
}

export default Board2;
