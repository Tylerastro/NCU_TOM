import { fetchTags } from "@/apis/tags";
import { Tag } from "@/models/helpers";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import * as React from "react";

const filter = createFilterOptions<Tag>();

export default function TagOptions(props: {
  placeholder: string;
  creatable: boolean;
  settags: Function;
  width?: string;
  refreshSignal?: boolean;
}) {
  const [value, setValue] = React.useState<Tag[]>([]);
  const { placeholder } = props;
  const { width } = props;
  const { settags } = props;
  const widthValue = width || "100%"; // Assigns "100%" if width is falsy

  const [tags, setTags] = React.useState<Tag[]>([]);

  React.useEffect(() => {
    fetchTags()
      .then((data) => {
        setTags(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [props.refreshSignal]);

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        const formattedTags = newValue.map((tag) => {
          if (typeof tag === "string") {
            return { name: tag, targets: [], observations: [] }; // Adjust as needed
          }
          return tag;
        });

        setValue(formattedTags);
        settags(formattedTags);
      }}
      filterOptions={(options: Tag[], params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        if (props.creatable && inputValue !== "") {
          const isExisting = options.some(
            (option) => inputValue === option.name
          );
          if (inputValue !== "" && !isExisting) {
            filtered.push({
              name: inputValue,
              targets: [],
              observations: [],
            });
          }
        }
        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="Tags"
      options={tags}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
        return option.name;
      }}
      sx={{ width: widthValue, paddingTop: "1.5rem" }}
      freeSolo
      multiple // Add this line to enable multiple selections
      renderTags={(tagValue, getTagProps) => {
        return tagValue.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option.name}
            label={option.name}
          />
        ));
      }}
      renderInput={(params) => <TextField {...params} label={placeholder} />}
    />
  );
}
