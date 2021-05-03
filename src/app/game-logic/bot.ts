export class Bot {}
// PSEUDO-CODE
//
// function minimax(node, depth, maximizingPlayer)
//     if depth = 0 or node is a terminal node
//         return the heuristic value of node
//     if maximizingPlayer
//         bestValue := -∞
//         for each child of node
//             # here is a small change
//             if freeTurn(child):
//                isMax := TRUE
//             else:
//                isMax := FALSE
//             val := minimax(child, depth - 1, isMax)
//             bestValue := max(bestValue, val)
//         return bestValue
//     else
//         bestValue := +∞
//         for each child of node
//             # here is a small change
//             if freeTurn(child):
//                isMax := FALSE
//             else:
//                isMax := TRUE
//             val := minimax(child, depth - 1, isMax)
//             bestValue := min(bestValue, val)
//         return bestValue
