import React, { createContext, useLayoutEffect, useState, useMemo, FC, ReactNode } from 'react';
import PropTypes from 'prop-types';


export interface IThemeContextProps {
    rightPanel: boolean;
    setRightPanel: React.Dispatch<React.SetStateAction<boolean>>;

}
const ThemeContext = createContext<IThemeContextProps>({} as IThemeContextProps);

interface IThemeContextProviderProps {
    children: ReactNode;
}
export const ThemeContextProvider: FC<IThemeContextProviderProps> = ({ children }) => {


    const [rightPanel, setRightPanel] = useState(false);



    const values: IThemeContextProps = useMemo(
        () => ({

            rightPanel,
            setRightPanel,
        }),
        [

            rightPanel,
            setRightPanel,
        ],
    );

    return <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>;
};
ThemeContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ThemeContext;
