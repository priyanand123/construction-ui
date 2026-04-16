import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ModalForm from "../../app/components/modalForm/modalForm";
import { TextSearchFilter } from "../../app/components/tableCmp/filters";
import "../../app/styles/addnew.css";
import "../../app/styles/bootstrap.css";
import Swal from "sweetalert2";
import "../../app/styles/style.css";
import "../../app/styles/bootstrap.min.css";
import styled from "styled-components";
import tileIcon from "../../app/assets/Constructionlogo1.jpeg";
import {
  fetchStockList,
  updateStockList,
} from "../../app/redux/slices/stock/stockslice";
import { routePath } from "../../app/routes/routepath";
//import { routePath as RP } from "../../app/routes/routepath";
const Dashboard = () => {
  const dispatch = useDispatch();
  const { stock } = useSelector((_state) => _state);
  const [formatedData, setFormattedData] = useState(stock?.data || []);
  const [rawMaterials, setrawMaterials] = useState([]);
  const [dataToEdit, setdataToEdit] = useState(null);
  const [brickNameTo, setBrickNameTo] = useState("");

  const [Quantity, setQuantity] = useState(0);

  const [manufacturingMaterials, setManufacturingMaterials] = useState([]);
  const [dataLoading, setdataLoading] = useState(true);
  const [showModalForm, setshowModalForm] = useState(false);
  const [viewOnly, setviewOnly] = useState(false);

  const navigation = useNavigate();

  // Monitor loading state of stock to toggle dataLoading
  useEffect(() => {
    dispatch(fetchStockList());
  }, [dispatch]);

  // Update formatted data if stock data changes
  useEffect(() => {
    debugger;
    if (stock?.data?.length < 1) return;
    setFormattedData(stock.data);
    setrawMaterials(
      stock.data.filter((item) => item.isManufacturingMaterial === false)
    );
    setManufacturingMaterials(
      stock.data.filter((item) => item.isManufacturingMaterial === true)
    );
  }, [stock.data]);

  const handleRawMaterialClick = () => {
    // Navigate to the combined path when the tile is clicked
    navigation(`${routePath.main}/${routePath.stock}`);
    // navigation.navigate(routePath.RP.stock);
  };
  const handleManufacturingMaterialClick = (material) => {
    debugger;

    var materialTwoItems = [];
    setshowModalForm(true);

    if (material.materialName.toString().includes("Shadow")) {
      materialTwoItems = manufacturingMaterials.filter((item) =>
        item.materialName.includes("Outdoor")
      )[0];
    } else if (material.materialName.toString().includes("Outdoor")) {
      materialTwoItems = manufacturingMaterials.filter((item) =>
        item.materialName.includes("ReadyToDispatch")
      )[0];
    } else if (material.materialName.toString().includes("ReadyToDispatch")) {
      debugger;
      //materialTwoItems= manufacturingMaterials.filter(item => item.materialName.includes("Sold"))[0];
      navigation(`${routePath.main}/${routePath.billing}`);
    }

    const dataList = {
      bricksIdFrom: material.materialId,
      brickNameFrom: material.materialName
        .toString()
        .split(/(?=[A-Z])/)
        .join(" "),
      count1: materialTwoItems.length==0?"":(material.currentStocks).toString(),
      modifiedBy: material.modifiedBy,
      unitId: material.unitId,
      bricksIdTo: materialTwoItems.length==0?"":materialTwoItems.materialId,
      brickNameTo:materialTwoItems.length==0?"": materialTwoItems.materialName
        .toString()
        .split(/(?=[A-Z])/)
        .join(" "),
      count2: materialTwoItems.length==0?"": (materialTwoItems.currentStocks).toString(),
      quantity: Quantity,
    };
    setFormattedData(dataList);
  };
  useEffect(() => {
    dispatch(fetchStockList());
  }, [dispatch]);

  // Update formatted data if stock data changes
  useEffect(() => {
    if (stock?.data?.length < 1) return;
    //setFormattedData(stock.data);
    setManufacturingMaterials(
      stock.data.filter((item) => item.isManufacturingMaterial === true)
    );
  }, [stock.data]);

  const updateData = async (formData) => {
    debugger;
    try {
      const dataBody = {
        bricksIdFrom: formData?.bricksIdFrom || 0,
        bricksIdTo: formData?.bricksIdTo || 0,
        unitId: formData?.unitId || 0,
        quantity: formData?.quantity || 0,
        modifiedBy: formData?.modifiedBy || formData?.createdBy || "string",
      };
      await updateStockList(dataBody, dispatch);
      dispatch(fetchStockList());
      closeModal();
      Swal.fire({
        title: "Awesome!",
        text: `${configData.masterTitle} Updated`,
        icon: "success",
      });
      setdataLoading(true); // Ensure loading state is reset after update
    } catch (error) {
      console.log(error);
      closeModal();
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: formatedData.brickNameFrom,
        accessor: "ShadowBricks",
        Filter: TextSearchFilter,
      },
      {
        Header: brickNameTo,
        accessor: "OutdoorBricks",
        Filter: TextSearchFilter,
      },
      {
        Header: "Ready to Dispatch Bricks",
        accessor: "ReadytoDispatchBricks",
        Filter: TextSearchFilter,
      },
    ],
    []
  );

  const configData = React.useMemo(
    () => ({
      masterTitle: "Manufacturing Materials",
    }),
    []
  );

  const formItems = [
    {
      label: formatedData.brickNameFrom,
      name: "count1",
      type: "text",
      maxLength: 20,
      required: true,
      placeholder: "Max 20 characters",
      className: "col-lg-6 col-md-12",
      //readOnly: true, 
      disabled: !viewOnly,  // Disable the field if viewOnly is true // Makes the field non-editable
    },
    {
      label: formatedData.brickNameTo,
      name: "count2",
      type: "text",
      maxLength: 20,
      required: true,
      placeholder: "Max 20 characters",
      className: "col-lg-6 col-md-12",
      //readOnly: true, 
      disabled: !viewOnly,  // Disable the field if viewOnly is true
    },
    {
      label: "No of bricks to move",
      name: "quantity",
      type: "number",
      maxLength: 20,
      required: true,
      placeholder: "Max 20 characters",
      className: "col-lg-6 col-md-12",
    },
  ];

  const editRowData = (rowData) => {
    debugger;

    setshowModalForm(true);
    setdataToEdit(formatedData);
  };

  const closeModal = () => {
    setdataToEdit(null);
    setshowModalForm(false);
    setviewOnly(false);
  };
  const handleClick = () => {
    // Navigate to the combined path when the tile is clicked
    // navigation(`${routePath.main}/${routePath.stock}`);
  };
  return (
    <MainContent>
      <div className="page-content">
        <div className="container-fluid position-relative">
          <div className="row">
            <div className="col-12">
              <TileContainer>
                <Label> Raw Materials Details</Label>
                {rawMaterials.map((material, index) => (
                  <Tile onClick={handleRawMaterialClick}>
                    <IconWrapper>
                      <h5>
                        {material.currentStocks || 0} {material.unit}
                      </h5>
                    </IconWrapper>
                    <Label>{material.materialName || "Miscellaneous"}</Label>
                  </Tile>
                ))}
              </TileContainer>
            </div>
            <div className="col-12">
              <TileContainer>
                <Label> Manufacturing Material Status</Label>
                {manufacturingMaterials
                  .slice() // Create a copy to avoid mutating the original array
                  .sort((a, b) => a.materialId - b.materialId) // Sort in ascending order by materialId
                  .map((material, index) => (
                    <Tile
                      key={`manufacturing-${index}`}
                      onClick={() => handleManufacturingMaterialClick(material)}
                    >
                      <IconWrapper>
                        <h5>
                          {material.currentStocks || 0} {material.unit}
                        </h5>
                      </IconWrapper>
                      <Label>
                        {material.materialName.split(/(?=[A-Z])/).join(" ") ||
                          "Miscellaneous"}
                      </Label>
                    </Tile>
                  ))}
              </TileContainer>

              <ModalForm
                title={configData.masterTitle}
                formItems={formItems}
                show={showModalForm}
                onEditData={formatedData}
                onHide={closeModal}
                onUpdate={updateData}
                masterData={formatedData}
                viewOnly={viewOnly}
              />
            </div>
          </div>
        </div>
      </div>
    </MainContent>
  );
};

export default Dashboard;
const PageContainer = styled.div`
  .dot {
    height: 8px;
    width: 8px;
    border-radius: 10px;
  }
  .dot1 {
    background-color: #572e8e;
  }
  .dot2 {
    background-color: #8d3d97;
  }
  .dot3 {
    background-color: #c6519e;
  }
`;
const TileContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px; /* Spacing between tiles */
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 30px; /* Adds space between rows */
`;
const Tile = styled.div`
  fflex: 1 1 15%; /* Each tile takes up 20% of the row */

  box-sizing: border-box; /* Includes padding and border in the width */
  height: 150px;
  width: 180px;
  border-radius: 35px;
  max-width: 100%; /* Ensures no tile exceeds 20% of the row width */
  display: flex;
  padding: 10px; /* Padding for content inside the tile */
  overflow: hidden; /* Prevents content from overflowing */
  flex-direction: column;
  word-wrap: break-word; /* Ensures long text wraps inside the tile */
  text-align: center; /* Centers the text content inside the tile */
  h5 {
    color: white; /* Sets the content color of h3 to white */
    margin: 0; /* Optional: Remove margin around h3 */
  }
  &:hover {
    transform: scale(
      1.05
    ); /* Add a hover effect to indicate the tile is clickable */
  }
`;
const MainContent = styled.div`
  padding: 2rem; /* Add space between the container and the nav menu */
  background-color: #f5f7fa; /* Light background color for the container */
  min-height: 100vh; /* Ensures full screen height */
  margin-left: 2rem; /* Add space to the left side */
`;

const IconWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(180deg, #2a3e52, #1f3b52);

  img {
    width: 70%; /* Increase this value to make the logo larger */
    height: auto;
  }
`;

const Label = styled.div`
  width: 100%;
  padding: 10px;
  text-align: center;
  background-color: #e0e0e0;
  font-size: 1rem;
  font-weight: bold;
  color: #333;
`;
