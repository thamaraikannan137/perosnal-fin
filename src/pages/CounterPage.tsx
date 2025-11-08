import { Button, MuiCard } from '../components/common';
import { useAppDispatch, useAppSelector } from '../store';
import { increment, decrement, incrementByAmount, reset } from '../store/slices/counterSlice';

export const CounterPage = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Redux Counter Example</h1>
      
      <MuiCard>
        <div className="text-center space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Current Count</p>
            <p className="text-6xl font-bold text-blue-600">{count}</p>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={() => dispatch(decrement())} color="secondary">
              Decrement
            </Button>
            <Button onClick={() => dispatch(increment())}>
              Increment
            </Button>
            <Button onClick={() => dispatch(incrementByAmount(5))} variant="outlined">
              Add 5
            </Button>
            <Button onClick={() => dispatch(reset())} color="secondary">
              Reset
            </Button>
          </div>
        </div>
      </MuiCard>
    </div>
  );
};

