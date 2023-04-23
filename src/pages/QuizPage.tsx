import { QuizPreview } from "../components/QuizPreview";
import { useAppDispatch } from "../hooks/hooks";
import { RouterProps } from "../interfaces/router";
import { getStudyGroup } from "../redux/game/actions";

export const QuizPage = ({navigation,route}:RouterProps) => {
    const dispatch = useAppDispatch()
    dispatch(getStudyGroup())
    return (
        <QuizPreview navigation={navigation} route={route} />
    )
}