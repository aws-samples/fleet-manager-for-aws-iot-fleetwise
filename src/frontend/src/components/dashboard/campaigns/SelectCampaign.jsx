import React from "react";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { lightGrayishBlue, darkNavyText } from "assets/colors";
import { makeStyles } from "@material-ui/core/styles";
import { ExpandMore, Clear } from "@material-ui/icons";

const SelectCampaign = ({
  campaigns, selectedCampign, handleSetSelectedCampaign, switchToFleetView
}) => {
  const classes = useStyles();
  const [openCampaign, setOpenCampaign] = React.useState('');
  const [rotation, setRotation] = React.useState(0);

  const handleChange = (event) => {
    const campaign = event.target.value
    handleSetSelectedCampaign(campaign)
  };

  const handleOpenCampaign = (event) => {
    setOpenCampaign(!openCampaign);
    setRotation(rotation + 180);
  };

  const handleClear = (event) => {
    event.stopPropagation();
    switchToFleetView()

  };

  const handleClose = () => {
    setOpenCampaign(false);
  };

  return (
    <div className={classes.mainContainer}>
      <div>
        <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
          <Select

            className={classes.mainBtn}
            value={selectedCampign}
            open={openCampaign}
            onClose={handleClose}
            onChange={handleChange}
            onClick={handleOpenCampaign}
            displayEmpty
            IconComponent={() =>
              selectedCampign === "Select campaign" ? (
                <ExpandMore
                  style={{ cursor: 'pointer', transform: `rotate(${rotation}deg)` }}
                  onClick={handleOpenCampaign}
                  className={classes.customIcon}>
                </ExpandMore>
              ) : (
                <Clear onClick={handleClear} className={classes.customIcon} />
              )
            }
            inputProps={{ 'aria-label': 'Without label' }}
            menuList={(provided, state) => ({
              ...provided,
              padding: 0
            })}
          >
            {campaigns.map(campaign => (
              <MenuItem className={classes.menuItem} value={campaign} key={campaign}>{campaign}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className={classes.verticalLine}>

      </div>
    </div>
  );

}

export default SelectCampaign;

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    marginTop: "1rem",
    marginBottom: "1rem",
    marginEnd: "1rem",
    display: "flex",
    alignItems: "center"
  },
  mainBtn: {
    height: "1.78rem",
    lineHeight: "1.78rem",
    borderRadius: "0.2rem",
    padding: "0 0.75rem 0 0",
    fontSize: "0.75rem",
    backgroundColor: lightGrayishBlue,
    color: darkNavyText,
    "&:hover": {
      cursor: "pointer",
    },
    "& .MuiSelect-outlined": {
      paddingRight: "0px"
    }
  },
  customIcon: {
    color: darkNavyText,
    height: "1rem"
  },
  menuItem: {
    fontSize: "0.75rem",
    color: darkNavyText,
  },
  verticalLine: {
    marginStart: "1rem",
    borderLeft: "1px solid #000", /* Adjust the color and thickness as needed */
    height: "1rem", /* Adjust the height of the line */
  }
}));