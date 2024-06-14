import React, { useEffect } from "react";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { lightGrayishBlue, darkNavyText } from "assets/colors";
import { makeStyles } from "@material-ui/core/styles";
import { ExpandMore } from "@material-ui/icons";

const SelectFleet = ({
    fleets,
    selectedFleet,
    handleSetSelectedFleet
}) => {
    const classes = useStyles();
    const [fleet, setFleet] = React.useState(selectedFleet);
    const [openFleet, setOpenFleet] = React.useState('');
    const [rotation, setRotation] = React.useState(0);
    useEffect(()=>{
     setFleet(selectedFleet)
    },[selectedFleet])

    const handleChange = (event) => {
        const fleet = event.target.value
        setFleet(fleet);
        handleSetSelectedFleet(fleet)
    };

    const handleOpenFleet = (event) => {
        setOpenFleet(!openFleet);
        setRotation(rotation + 180);
    };

    const handleClose = () => {
        setOpenFleet(false);
    };

    return (
        fleets?.length!==0?
        <div className={classes.mainContainer}>
            <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
                <Select
                    className={classes.mainBtn}
                    value={fleet}
                    open={openFleet}
                    onClose={handleClose}
                    onChange={handleChange}
                    onClick={handleOpenFleet}
                    displayEmpty
                    IconComponent={() =>
                        <ExpandMore
                            style={{ cursor: 'pointer', transform: `rotate(${rotation}deg)` }}
                            onClick={handleOpenFleet}
                            className={classes.customIcon}>
                        </ExpandMore>
                    }
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    {fleets.map(fleet => (
                        <MenuItem className={classes.menuItem} value={fleet.id} key={fleet.id}>{fleet.id}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>:null
                    );
    

}

export default SelectFleet;

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        marginEnd: "1rem",
    },
    mainBtn: {
        height: "1.78rem",
        lineHeight: "1.78rem",
        borderRadius: "0.2rem",
        padding: "0 0.75rem 0 0",
        fontSize: "0.75rem",
        backgroundColor: lightGrayishBlue,
        color: darkNavyText,
        fontWeight: 'normal',
        textTransform: 'none',
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
    }
}));
