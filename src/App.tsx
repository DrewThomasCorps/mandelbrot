import React, {ChangeEventHandler, FocusEventHandler, MouseEventHandler, useEffect, useRef, useState} from 'react';
import './App.css';

function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [maxIterations, setMaxIterations] = useState(50);
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [zoomLevel, setZoomLevel] = useState(0.8);
    const [bounds, setBounds] = useState({
        lower: -1.2,
        left: -2,
        height_range: 2.4,
        width_range: 2.5,
    });

    useEffect(() => {
        const workersArr: Worker[] = [];

        let workerCount = navigator.hardwareConcurrency;
        if (!workerCount) {
            workerCount = 4;
        }

        for (let i = 0; i < workerCount; i++) {
            const worker = new Worker("./mandelbrot-worker.js");
            workersArr.push(worker);
        }
        setWorkers(workersArr);
        return () => {
            workersArr.map(worker => worker.terminate());
        };
    }, []);

    useEffect(() => {

        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!context || !canvas) {
            return;
        }
        // get current size of the canvas
        let rect = canvas.getBoundingClientRect();

        // increase the actual size of our canvas
        canvas.width = rect.width * devicePixelRatio;
        canvas.height = rect.height * devicePixelRatio;

        // ensure all drawing operations are scaled
        context.scale(devicePixelRatio, devicePixelRatio);

        // scale everything down using CSS
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';

        workers.forEach(worker => {
            worker.onmessage = ({data: {row_start, iterationsArray}}) => {
                for (let row = row_start; row < row_start + iterationsArray.length; row++) {
                    for (let column = 0; column < iterationsArray[0].length; column++) {
                        const iterationsTillUnbounded = iterationsArray[row - row_start][column];
                        const color = (iterationsTillUnbounded / maxIterations) * 255;
                        context.fillStyle = `rgb(${color * 0.9}, ${color * 0.2}, ${color * 0.2})`;
                        context.fillRect(row, column, 1, 1);
                    }
                }
            };
        });
    }, [workers, canvasRef, maxIterations]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!context || !canvas) {
            return;
        }
        // get current size of the canvas
        let rect = canvas.getBoundingClientRect();

        for (let i = 0; i < workers.length; i++) {
            workers[i].postMessage({
                row_start: Math.floor(i * (rect.width / workers.length)),
                row_end: Math.ceil((i + 1) * (rect.width / workers.length)),
                rect,
                bounds,
                maxIterations: maxIterations,
            });
        }
    }, [bounds, maxIterations, workers]);

    const updateMaxIterations: FocusEventHandler<HTMLInputElement> = (e) => {
        setMaxIterations(Number.parseInt(e.target.value));
    };

    const zoom: MouseEventHandler<HTMLCanvasElement> = event => {
        const canvasXClick = event.pageX - event.currentTarget.offsetLeft;
        const canvasYClick = event.pageY - event.currentTarget.offsetTop;
        const canvasXCenter = event.currentTarget.getBoundingClientRect().width / 2;
        const canvasYCenter = event.currentTarget.getBoundingClientRect().height / 2;
        const xOffset = (canvasXClick - canvasXCenter) / event.currentTarget.getBoundingClientRect().width;
        const yOffset = (canvasYClick - canvasYCenter) / event.currentTarget.getBoundingClientRect().height;

        console.log(xOffset);
        console.log(yOffset);

        const newBounds = {
            width_range: bounds.width_range * zoomLevel,
            left: (bounds.left + (bounds.width_range * xOffset)) - ((bounds.width_range * zoomLevel) - bounds.width_range)/2,
            height_range: bounds.height_range * zoomLevel,
            lower: (bounds.lower + (bounds.height_range * yOffset)) - ((bounds.height_range * zoomLevel) - bounds.height_range)/2,
        };
        setBounds(newBounds);
    };

    const updateZoomLevel: ChangeEventHandler<HTMLInputElement> = (event) => {
        setZoomLevel(Number.parseFloat(event.target.value));
    };

    return (
        <div className="App">
            <canvas ref={canvasRef} className={"mandelbrot"} onClick={zoom}>
            </canvas>
            <input type={"number"} defaultValue={maxIterations} onBlur={updateMaxIterations}/>
            <input type={"number"} defaultValue={zoomLevel} onChange={updateZoomLevel}/>
        </div>
    );
}

export default App;
