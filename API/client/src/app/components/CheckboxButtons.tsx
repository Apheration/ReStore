import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useState } from "react";

interface Props {
    items: string[],
    checked?: string[],
    onChange: (items: string[]) => void; // want to return items from this list

}

export default function CheckBoxButtons({ items, checked, onChange }: Props) {
    // create local state for checked items.  checked can be undefined, if so return empty array
    const [checkedItems, setCheckedItems] = useState(checked || [])

    function handleChecked(value: string) {
        // check the item in array is matching value of what has been clicked
        // returns -1 if not there
        const currentIndex = checkedItems.findIndex(item => item === value);
        // array for new checked items
        let newChecked: string[] = [];
        // if current index == -1, new items to add to array of checked items
        if (currentIndex === -1) newChecked = [...checkedItems, value];
        // give list of items minus the item we are unchecking
        else newChecked = checkedItems.filter(item => item !== value);
        // update state with newChecked
        setCheckedItems(newChecked);
        // something was checked/unchecked, create and return new array to redux state (to parent component)
        onChange(newChecked);
1    }

    return (
        <FormGroup>
            {items.map(item => (
                <FormControlLabel
                    control={<Checkbox
                        checked={checkedItems.indexOf(item) !== -1}
                        onClick={() => handleChecked(item)}
                    />}
                    label={item}
                    key={item}

                />
            ))}

        </FormGroup>
    )
}