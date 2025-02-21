import rickroll from "../assets/rickroll-roll.gif";
export default function UserDash() {
  return (
    <div>
      <div className="w-1/3 mx-auto">
        <img alt="rick-roll" className="w-full" src={rickroll} />
      </div>
    </div>
  );
}
