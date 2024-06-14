import React from "react";
import SortIcon from "assets/img/sort-ascending.png";


const CustomHeaderTextWithImage = ({
  handleSort,
  isCampaignSelected
}
) => {
  return (
    <div
      onClick={handleSort}
      style={{
        cursor: "pointer",
        top: 0,
        paddingLeft: "16px",
        position: "sticky",
        textAlign: "center",
        backgroundColor: "#3F51B5",
        display: "flex",
        color: "white",
        height: isCampaignSelected ? "130px" : "80px",
        alignItems: "center"
      }}>
      <div style={{ fontFamily: "AmazonEmber", }}>
        VIN

      </div>
      <div style={{ fontFamily: "AmazonEmber", marginLeft: isCampaignSelected ? "60px" : "80px", marginRight: isCampaignSelected ? "20px" : "0px" }}>
        <img
          src={SortIcon}

        />
      </div>
    </div >
  );
};

export default CustomHeaderTextWithImage;