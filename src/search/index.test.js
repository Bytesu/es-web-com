import Search from './index';
import {act, Simulate} from 'react-dom/test-utils';
import ReactDOM, {unmountComponentAtNode} from 'react-dom';


let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});
const _value = 'label';

function searchFn() {
    return {
        cancel: false,
        list: [
            {id: 1, label: _value, value: _value}
        ]
    }
}

it('renders search component', async () => {
    act(() => {
        ReactDOM.render(<Search
            search={searchFn}
        />, container);
    });
    const input = container.querySelector('.search-input-ctner input');
    let suggestion = container.querySelector('.search-input-ctner .suggestion-ctner');

    expect(input.placeholder).toBe('请输入搜索关键字');
    expect(suggestion).toBeNull();

});

it('display search keyword reslut', async () => {
    await act(async () => {
        ReactDOM.render(<Search
            keyword="react"
            search={searchFn}
        />, container);
    });
    const suggestionItem = container.querySelector('.suggestion-ctner .suggestion-item')
    expect(suggestionItem.textContent).toBe(_value);
});

it('hightlight selected reslut list item', async () => {
    await act(async () => {
        ReactDOM.render(<Search
            keyword="react"
            search={searchFn}
        />, container);
    });
    const input = container.querySelector('.search-input-ctner input');

    Simulate.click(input);
    Simulate.keyDown(input, {key: "Down", keyCode: 40, which: 40});
    const suggestionItem = container.querySelector('.suggestion-ctner .suggestion-item-active')
    expect(suggestionItem.textContent).toBe(_value);
});

it('input `item.value`  that selected  list item ', async () => {
    jest.spyOn(window, 'open').mockImplementation(() => {});

    await act(async () => {
        ReactDOM.render(<Search
            keyword="react"
            search={searchFn}
        />, container);
    });
    const input = container.querySelector('.search-input-ctner input');

    Simulate.click(input);
    Simulate.keyDown(input, {key: "Down", keyCode: 40, which: 40});
    Simulate.keyDown(input, {key: "Enter", keyCode: 13, which: 13});
    expect(input.value).toBe(_value);
});


