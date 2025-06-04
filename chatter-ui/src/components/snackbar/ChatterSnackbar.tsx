import Alert from '@mui/material/Alert';
import { Snackbar, SnackbarCloseReason } from '@mui/material';
import { useReactiveVar } from '@apollo/client';
import { snackVar } from '../../constants/snack';

const ChatterSnackbar = () => {
  const snack = useReactiveVar(snackVar);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    snackVar(undefined);
  };

  return (
    <>
      {
        snack && (
          <div>
            <Snackbar open={!!snack} autoHideDuration={6000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity={snack.type}
                variant="filled"
                sx={{ width: '100%' }}
              >
                {snack.message}
              </Alert>
            </Snackbar>
          </div>
        )
      }
    </>
    
  );
}

export default ChatterSnackbar;