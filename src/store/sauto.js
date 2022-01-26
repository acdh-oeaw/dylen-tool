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


export var sauto_mixin = {
    methods: {
        mouseMove(event, sautoId) {
            if (this.$store.state.sauto.sauto === false) {
                return;
            }
            if (event.target.nodeType === Node.TEXT_NODE) {
                return;
            }

            const timestamp = Date.now();

            if (sautoId === null || sautoId === undefined) {
                sautoId = this.getNearestSautoId(event.target).getAttribute('data-sauto-id');
            }

            //send if mouseover new component
            if (sautoId !== this.$store.state.lastOverElement) {
                const mouseOver = {
                    id: sautoId,
                    type: 'MouseOver',
                    timestamp: timestamp
                };
                this.$store.state.lastOverElement = sautoId;
                this.$store.dispatch('sauto/handleMouseOver', { mouseOver });
            }

            const movement = this.calculateMousePosition(event);
            movement.timestamp = timestamp;
            this.$store.dispatch('sauto/handleMouseMove', { movement });
        },
        keyPress(event, id) {
            if (this.$store.state.sauto.sauto === false) {
                return;
            }

            //currently im logging only keypress on searchTargetWord input and nothing else, so id is that.
            const keyPress = {
                id,
                type: 'KeyPress',
                timestamp: Date.now(),
                key: event.key,
                charCode: event.charCode
            };

            this.$store.dispatch('sauto/handleKeyPress', { keyPress });
        },
        resize(paneId) {
            if (this.$store.state.sauto.sauto === false) {
                return;
            }
            const resized = {
                paneId: paneId
            };
            this.$store.dispatch('sauto/handleResize', { resized });
        },
        scroll(event, sautoId) {
            if (this.$store.state.sauto.sauto === false) {
                return;
            }
            const scroll = {
                id: sautoId ? sautoId : this.getNearestSautoId(event.target).getAttribute('data-sauto-id'),
                timestamp: Date.now(),
                height: event.deltaY
            };
            this.$store.dispatch('sauto/handleScroll', { scroll });
        },
        mouseClick(event, sautoId) {
            if (this.$store.state.sauto.sauto === false) {
                return;
            }
            if (event.target && event.target.tagName === 'path') {
                //hack around svgs. because path doesnt have parent but has this instead
                event = {
                    ...event,
                    clientX: event.target.ownerDocument.activeElement.getBoundingClientRect().x,
                    clientY: event.target.ownerDocument.activeElement.getBoundingClientRect().y,
                    target: event.target.ownerDocument.activeElement,
                };
            }

            const click = this.calculateMousePosition(event);

            click.id = sautoId ? sautoId : this.getNearestSautoId(event.target).getAttribute('data-sauto-id');

            //hacky workaround for double registered clicks
            if (click.id === 'ignore') {
                return;
            }

            click.timestamp = Date.now();

            this.$store.dispatch('sauto/handleMouseClick', { click });
        },
        dragStart(event) {
            if (this.$store.state.sauto.sauto === false) {
                return;
            }

            const dragStart = this.calculateMousePosition(event);
            dragStart.timestamp = Date.now();

            this.$store.state.sauto.currentDrag = { start: dragStart };
        },
        dragEnd(event, sautoId) {
            if (this.$store.state.sauto.sauto === false) {
                return;
            }
            const dragEnd = this.calculateMousePosition(event);

            dragEnd.timestamp = Date.now();

            let drag = this.$store.state.sauto.currentDrag;
            drag.id = sautoId;
            drag.end = dragEnd;

            this.$store.dispatch('sauto/handleDrag', { drag });
            this.$store.state.sauto.currentDrag = null;
        },
        calculateMousePosition(event) {
            let clientX = event.clientX;
            let clientY = event.clientY;

            //there is a bug with selects which register mouse position as 0,0 when clicked on
            //so i take the element position instead of click position in such cases
            if (clientX === 0 && clientY === 0) {
                const rect = event.target.getBoundingClientRect();
                clientX = rect.x;
                clientY = rect.y;
            }

            //get mouse position in percentage relative to top element size
            const elementSizes = this.$store.state.sauto.size;
            const x = clientX - elementSizes.left;
            const y = clientY - elementSizes.top;

            return {
                x: (x * 100) / elementSizes.width,
                y: (y * 100) / elementSizes.height
            };
        },
        getNearestSautoId(element) {
            if (element.getAttribute('data-sauto-id') === null) {
                // go up in tree until an element with this attribute is found
                while (
                    (element = element.parentElement) &&
                    !element.getAttribute('data-sauto-id')
                    ) ;
            }
            return element;
        }
    }
};
