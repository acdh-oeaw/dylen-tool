import props from "@/properties/propertiesLoader";
import logger from "@/helpers/logger";

export const sautoModule = {
    namespaced: true,
    state: {
        connection: null,
        lastOverElement: null,
        sauto: false,
        size: null,
        currentDrag: null
    },
    actions: {
        setBoundingClientRect({ state }, { size }) {
            state.size = size;
        },
        async connect({ state }) {
            if (state.sauto) {
                logger.log(props.sautoURI);
                state.connection = new WebSocket(props.sautoURI);
                state.connection.onerror = function(event) {
                    logger.error(event);
                };
                state.connection.onopen = function() {
                    logger.log('Connection with Sauto backed established successfully.');
                    state.connection.send(
                        JSON.stringify({
                            appVersion: props.appVersion,
                            type: 'VersionInfo'
                        })
                    );
                };
            }
        },
        agree({ state }, { agreed }) {
            state.sauto = agreed;
            if (agreed) {
                this.dispatch('sauto/connect');
            }
        },
        async handleMouseMove({ state }, { movement }) {
            //send mouse positions
            movement.type = 'MousePosition';
            state.connection.send(JSON.stringify(movement));
        },
        async handleMouseOver({ state }, { mouseOver }) {
            state.connection.send(JSON.stringify(mouseOver));
        },
        async handleKeyPress({ state }, { keyPress }) {
            state.connection.send(JSON.stringify(keyPress));
        },
        async handleResize({ state }, { resized }) {
            if (resized.paneId !== undefined) {
                resized.type = 'Resize';
                state.connection.send(JSON.stringify(resized));
            }
        },
        async handleMouseClick({ state }, { click }) {
            //send mouse click
            click.type = 'MouseClick';
            state.connection.send(JSON.stringify(click));
        },
        async handleDrag({ state }, { drag }) {
            //send mouse drag and drop
            drag.type = 'Drag';
            state.connection.send(JSON.stringify(drag));
        },
        async handleScroll({ state }, { scroll }) {
            //send mouse scroll
            scroll.type = 'Scroll';
            state.connection.send(JSON.stringify(scroll));
        }
    }
};