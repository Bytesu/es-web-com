import React, {useCallback, useEffect,useState} from "react";
import Autosuggest from "react-autosuggest";
import "./index.scss"

export function formatSuggestionItem(list, name, val) {
    return list.map(item => {
        return {
            name: item[name],
            val: item[val]
        }
    })
}

export function AutoComponent(props) {
    const languages = props.suggestions ?? [];

    const [suggestions, setSuggestions] = useState([]);
    const [value, setValue] = useState(props.selected ?? "");
    const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const suggestionFn = useCallback(async (keyword) => {
        let res = [];
        if (props.suggestFn)
            res = await props.suggestFn(keyword);
        return res;
    }, [props]);
    useEffect(()=>{
        setValue(props.selected||'');
    },[props.selected])
    const getSuggestions = async (value) => {
        const escapedValue = escapeRegexCharacters(value.trim());

        if (escapedValue === '') {
            return [];
        }
        let remoteOption = [];
        if (languages.length === 0) {
            remoteOption = await suggestionFn(value);
        }
        const options = [
            ...languages,
            ...remoteOption
        ];
        const regex = new RegExp('^' + escapedValue, 'i');
        const suggestions = options.filter(language => regex.test(language.name));

        if (suggestions.length === 0) {
            return [
                {isAddNew: true}
            ];
        }
        return suggestions;
    };

    return (
        <Autosuggest
            renderInputComponent={(inputProps) => {
                return <div>
                    <input {...inputProps} name={props.name||''} className="form-control"/>
                </div>
            }}
            suggestions={suggestions}
            onSuggestionsFetchRequested={async ({value}) => {
                let res = await getSuggestions(value);
                setSuggestions(res)
            }}
            onSuggestionsClearRequested={() => {

                setSuggestions([])
            }}
            getSuggestionValue={suggestion => {
                if (suggestion.isAddNew) {
                    return value;
                }
                return suggestion.name;
            }}
            renderSuggestion={suggestion => {
                if (suggestion.isAddNew) {
                }
                return suggestion.name;
            }}
            onSuggestionSelected={(event, {suggestion}) => {
                if (suggestion.isAddNew) {
                }
                props.onSelected?.(suggestion)
            }}
            inputProps={{
                placeholder: props.placeholder || "请输入内容",
                value: value,
                onChange: (event, {newValue, ...arg}) => {

                    setValue(props.formatText?.(newValue)??newValue)
                    props.onChange?.(newValue)
                }
            }}
        />
    );
}
