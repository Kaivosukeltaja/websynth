const PresetSelector = ({ preset, onSelect }) => (
    <button onClick={() => onSelect(preset)}>
        {preset.name}
    </button>
)

export default PresetSelector
