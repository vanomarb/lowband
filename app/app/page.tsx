import Demo from "../../Demo";

export default function AppPage() {
  // ?web keeps phones on the web player instead of sending them back to the phone app (see phone.ts).
  return <Demo homeHref="/?web=1" />;
}
