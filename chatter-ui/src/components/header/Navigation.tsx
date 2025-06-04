import { Box, Button } from "@mui/material";
import { Page } from "../../interfaces/page.interface";
import router from "../Routes";


interface NaviagationProps {
    pages: Page[];
}

const Navigation = ({ pages }: NaviagationProps) => {
    return (
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                onClick={() => {
                    router.navigate(page.path);
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.title}
              </Button>
            ))}
          </Box>
    )
}

export default Navigation;