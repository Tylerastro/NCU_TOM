from abc import ABC, abstractmethod


class BaseCodeGenerator(ABC):
    @abstractmethod
    def gen_code(self, observation_id) -> str:
        raise NotImplementedError

    @abstractmethod
    def get_codes(self, start_date: str, end_date: str) -> str:
        raise NotImplementedError


# --- Code generator registry ---

CODE_GENERATORS: dict[int, BaseCodeGenerator] = {}


def register_code_generator(observatory_id: int, generator: BaseCodeGenerator):
    CODE_GENERATORS[observatory_id] = generator


def get_code_generator(observatory_id: int) -> BaseCodeGenerator:
    try:
        return CODE_GENERATORS[observatory_id]
    except KeyError:
        raise ValueError(f"No code generator registered for observatory id={observatory_id}")
