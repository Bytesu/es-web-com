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

    genKey(prefix='key_') {
        return prefix + this.uniqKeyIndex++;
    }

    genId() {
        return this.genKey();
    }

    className(...args) {
        const {className} = this.props;
        return this.classNames.apply(this, args.concat([className]));
    }

    style(args) {
        const {style} = this.props;
        return Object.assign({}, args, style)
    }

    setSta(param = {}) {
        if (!Object.keys(param).length) return;
        const self = this;
        return new Promise((resolve) => {
            self.setState(param, () => {
                resolve([])
            });
        })

    }
}

export class ErrorBoundary extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        // show error ui
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        // report to server
        this.logErrorToMyService(error, errorInfo);
    }

    logErrorToMyService = (error, errorInfo) => {
        console.warn(error)
        console.warn(errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return <h1>search component went wrong.</h1>;
        }

        return this.props.children;
    }


}
