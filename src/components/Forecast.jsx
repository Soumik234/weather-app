import React from "react";

function Forecast({ title, data }) {
  return (
    <div>
      <div className="flex items-center justify-start mt-6">
        <p className="text-white font-medium uppercase">{title}</p>
      </div>
      <hr className="my-2" />
      <div className="flex flex-row items-center justify-between text-white">
        {Array.isArray(data) ? (
          data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center"
            >
              <p className="font-light text-sm">{item.title}</p>

              <img
                src={
                  item.icon.toString().length === 2
                    ? `https://developer.accuweather.com/sites/default/files/${item.icon}-s.png`
                    : `https://developer.accuweather.com/sites/default/files/0${item.icon}-s.png`
                }
      
                className="w-12 my-1"
                alt=""
              />
              

              <p className="font-medium">{item.temp}°C</p>
            </div>
          ))
        ) : (
          <p className="text-white">No data available</p>
        )}
      </div>
    </div>
  );
}

export default Forecast;
