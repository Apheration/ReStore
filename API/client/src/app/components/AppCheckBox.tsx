import { Checkbox, FormControlLabel } from "@mui/material";
import { UseControllerProps, useController } from "react-hook-form";

interface Props extends UseControllerProps {
    label: string;
    disabled: boolean;
}
export default function AppCheckBox(props: Props) {
    //spread props into the field object with additional prop of defaultvalue
    //includes onchange onBlur etc from useController hook
    const { field } = useController({ ...props, defaultValue: false });

    return (
        <FormControlLabel
            control={
                <Checkbox
                    {...field}
                    checked={field.value}
                    color='secondary'
                    disabled={props.disabled}
                />

            }
            label={props.label}
         />
    )
}