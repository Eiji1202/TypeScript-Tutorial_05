import axios from "axios";

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;
const GOOGLE_API_KEY = "AIzaSyDl_Z5jEw8WusINP2lNJhJieVUvGmr4YkU";

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

declare let google: any;

function searchAddressHandler(event: Event) {
  event.preventDefault();
  // inputで入力された値（場所、住所）を取得
  const enteredAddress = addressInput.value;

  // GoogleAPI に送信し、座標値を取得
  axios
    .get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`)
    .then((response) => {
      if (response.data.status !== "OK") {
        throw new Error("座標を取得できませんでした");
      }
      // 入力された値から座標値を取得
      const coordinates = response.data.results[0].geometry.location;

      // 地図を描画
      const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: coordinates,
        zoom: 16,
      });
      // 地図にマーカーを追加
      new google.maps.Marker({ position: coordinates, map: map });
    })
    .catch((error) => {
      alert(error.message);
      console.log(error);
    });
}

// formが送信されたらsearchAddressHandler関数を実行
form.addEventListener("submit", searchAddressHandler);
