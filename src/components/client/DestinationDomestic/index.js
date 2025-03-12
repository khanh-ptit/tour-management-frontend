function DestinationDomestic() {
  return (
    <div className="container">
      <div className="row">
        {/* Ô hợp nhất (chiếm 2 hàng) */}
        <div
          className="col-md-4 d-flex flex-column"
          style={{ backgroundColor: "lightblue", padding: "20px" }}
        >
          <h5>Ô hợp nhất (2 hàng)</h5>
        </div>

        {/* Hai ô còn lại trong hàng đầu tiên */}
        <div className="col-md-8">
          <div className="row">
            <div
              className="col-md-6 col-sm-6 col-6"
              style={{ backgroundColor: "lightcoral", padding: "20px" }}
            >
              <h5>Ô 1.2</h5>
            </div>
            <div
              className="col-md-6 col-sm-6 col-6"
              style={{ backgroundColor: "lightgreen", padding: "20px" }}
            >
              <h5>Ô 1.3</h5>
            </div>
          </div>
          <div className="row">
            <div
              className="col-md-6 col-sm-6 col-6"
              style={{ backgroundColor: "lightpink", padding: "20px" }}
            >
              <h5>Ô 2.2</h5>
            </div>
            <div
              className="col-md-6 col-sm-6 col-6"
              style={{ backgroundColor: "lightgray", padding: "20px" }}
            >
              <h5>Ô 2.3</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DestinationDomestic;
