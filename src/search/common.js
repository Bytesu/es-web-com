import {PureComponent} from "react";

/**
 * base pure component
 */
export class _PureComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.setSta.bind(this)
        this.uniqKeyIndex = 1;
    }

    genKey() {
        return this.uniqKeyIndex++;
    }

    className(...args) {
        const { className } = this.props;
        return this.classNames.apply(this, args.concat([className]));
    }

    style(args) {
        const { style } = this.props;
        return Object.assign({}, args, style)
    }
    setSta(param = {}) {
        if (!Object.keys(param).length) return;
        // debugger;
        this.setState(Object.assign({}, this.state, param));
    }
}
