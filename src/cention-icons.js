/**
 * CentionIcons icon set component.
 * Usage: <CentionIcons name="icon-name" size={20} color="#4F8EF7" />

 */
import Svg, { Path } from 'react-native-svg';
import selectionsData from './selection.json'
const getPathsForIcon = (iconName) => {
    const icon = selectionsData.icons.find(item => item.properties.name === iconName);
    return icon ? icon.icon.paths : [];
  };

const CentionIcon = ({ name, size, color }) => {
    const pathds = getPathsForIcon(name);

    if (!pathds) {
      console.error(`Icon not found: ${name}`);
      return null;
    }
  
    return (
      <Svg width={size} height={size}  viewBox="0 0 1024 1024">
        {pathds.map((path, index) => (
          <Path key={index} d={path} fill={color}/>
        ))}
      </Svg>
    );
  };
export default CentionIcon;


