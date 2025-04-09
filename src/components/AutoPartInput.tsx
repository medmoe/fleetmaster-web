import React, {useEffect, useMemo, useState} from 'react';
import {Autocomplete, Box, InputAdornment, Paper, TextField} from '@mui/material';
import {Search as SearchIcon} from '@mui/icons-material';
import {PartType} from "../types/maintenance.ts";



interface AutoPartInputProps {
    handlePartInputChange: (value: string) => void;
    parts: PartType[];
    searchTerm: string;
    selectPart: (name: string, id: string) => void;
    isPartSelected: boolean;
    setIsPartSelected: (selected: boolean) => void;
    icon?: React.ReactNode;
}

const AutoPartInput: React.FC<AutoPartInputProps> = ({
                                                         handlePartInputChange,
                                                         parts,
                                                         searchTerm,
                                                         selectPart,
                                                         isPartSelected,
                                                         setIsPartSelected,
                                                         icon = <SearchIcon/>
                                                     }) => {
    // Building the trie outside of render for better performance
    const trie = useMemo(() => {
        const trieStructure: { [key: string]: any } = {};

        const addWord = (word: string, id = "") => {
            let currentNode = trieStructure;
            for (let i = 0; i < word.length; i++) {
                const char = word[i];
                if (!currentNode[char]) {
                    currentNode[char] = {};
                }
                currentNode = currentNode[char];
            }
            currentNode['$'] = {id, exists: true};
        };

        parts.forEach(item => addWord(item.name, item.id?.toString()));
        return trieStructure;
    }, [parts]);

    const getSuggestions = (prefix: string): PartType[] => {
        if (!prefix) return [];

        let currentNode = trie;
        for (let i = 0; i < prefix.length; i++) {
            const char = prefix[i];
            if (!currentNode[char]) return [];
            currentNode = currentNode[char];
        }

        const suggestions: PartType[] = [];

        const collectWords = (node: any, prefix: string) => {
            if (node["$"]) {
                suggestions.push({id: node["$"].id, name: prefix});
            }
            for (const char in node) {
                if (char !== "$") {
                    collectWords(node[char], prefix + char);
                }
            }
        };

        collectWords(currentNode, prefix);
        return suggestions;
    };

    // Using MUI Autocomplete's filtering instead of manual filtering
    const [filteredOptions, setFilteredOptions] = useState<PartType[]>([]);

    useEffect(() => {
        if (isPartSelected) {
            setIsPartSelected(false);
        } else {
            const suggestions = getSuggestions(searchTerm);
            setFilteredOptions(suggestions);
        }
    }, [searchTerm, isPartSelected, setIsPartSelected]);

    // Handle selection from Autocomplete
    const handleSelection = (event: React.SyntheticEvent, value: PartType | null) => {
        if (value) {
            selectPart(value.name, value.id);
        }
    };

    // Handle input change
    const handleInputChange = (event: React.SyntheticEvent, newValue: string) => {
        handlePartInputChange(newValue);
    };

    return (
        <Box className="w-full">
            <Autocomplete
                freeSolo
                disableClearable
                options={filteredOptions}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                inputValue={searchTerm}
                onInputChange={handleInputChange}
                onChange={handleSelection}
                filterOptions={(x) => x} // Disable the built-in filtering of the Autocomplete component
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Find part"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    {icon}
                                </InputAdornment>
                            ),
                            className: "bg-background p-2 rounded",
                        }}
                    />
                )}
                renderOption={(props, option) => (
                    <Paper
                        component="li"
                        {...props}
                        elevation={2}
                        className="my-1 p-2 hover:bg-gray-50"
                        sx={{
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
                        }}
                    >
                        {option.name}
                    </Paper>
                )}
                PaperComponent={({children}) => (
                    <Paper
                        elevation={4}
                        sx={{
                            mt: 1,
                            borderRadius: '12px',
                            padding: '8px'
                        }}
                    >
                        {children}
                    </Paper>
                )}
            />
        </Box>
    );
};

export default AutoPartInput;