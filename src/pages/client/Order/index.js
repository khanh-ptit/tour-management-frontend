import { useSelector } from "react-redux";

function Order() {
  const { toursOrder } = useSelector((state) => state.cartReducer);

  console.log(toursOrder);

  return <>Order</>;
}

export default Order;
