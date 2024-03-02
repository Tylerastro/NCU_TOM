import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";

export default function BasicAccordion() {
  return (
    <div>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6" color={"primary"}>
            This is a testing stage
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Thank you for tesing the server at the early-stage. If you encounter
            any issues, or have any suggestions. please contact{" "}
            <a href="https://mail.google.com/mail/?view=cm&source=mailto&to=hantanglin70036440@gamil.com">
              @Tylerastro
            </a>{" "}
            without hesitations. Every opinion is important to us.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography variant="h6" color={"primary"}>
            The data storage
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Service is at an early development stage. Do <em>NOT</em> store any
            persistent data on the server.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
