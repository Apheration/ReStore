// custom TextField

import { TextField } from "@mui/material";
import { UseControllerProps, useController } from "react-hook-form";

// inherit the props from UserControllerProps plus label
interface Props extends UseControllerProps {
    label: string;
}
export default function AppTextInput(props: Props) {
    // spread props object and add prop defaultValue
    const { fieldState, field } = useController({...props, defaultValue: ''})
    return (
        // add TextField with all passed props (spread out each prop individually, it's like it's just collapsed right now)
        <TextField   
            {...props}
            //onBlur event
            {...field}
            //full width of container
            fullWidth
            variant='outlined'
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
        />
    )
}