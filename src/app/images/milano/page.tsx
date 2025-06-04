import {Duomo} from "./Duomo"
import {Lac} from "./Lac"
import {Starbucks} from "./Starbucks"
import {Centre} from "./Centre"
import {Chateau} from "./Chateau"
import {Tram} from "./Tram"
export default function Milano() {
  return (
    <div>
      <Centre />
      <Duomo />
      <Lac />
      <Starbucks />
      <Chateau />
      <Tram />
    </div>
  );
}