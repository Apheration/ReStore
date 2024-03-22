import { Typography, Grid} from "@mui/material";
import AppTextInput from "../../app/components/AppTextInput";
import { useFormContext } from "react-hook-form";
import AppCheckBox from "../../app/components/AppCheckBox";


export default function AddressForm() {
    // control: to pass to AppTextInput
    // formState for isDirty (was it modified - someone typed something)
    const { control, formState } = useFormContext();
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Shipping address
            </Typography>
                <Grid container spacing={3}>
                    {/* sm={12} take up all 12 columns */}
                    <Grid item xs={12} sm={12}>
                        <AppTextInput control={control} name='fullName' label='Full Name' />
                    </Grid>
                    <Grid item xs={12}>
                        <AppTextInput control={control} name='address1' label='Address 1' />
                    </Grid>
                    <Grid item xs={12}>
                        <AppTextInput control={control} name='address2' label='Address 2' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppTextInput control={control} name='city' label='City' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppTextInput control={control} name='state' label='State' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppTextInput control={control} name='zip' label='Zip Code' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppTextInput control={control} name='country' label='Country' />
                    </Grid>
                    <Grid item xs={12}>
                    <AppCheckBox
                        disabled={!formState.isDirty}
                        name='saveAddress'
                        label='Save this as the default address'
                        control={control} />
                    </Grid>
                </Grid>


        </>
    );
}