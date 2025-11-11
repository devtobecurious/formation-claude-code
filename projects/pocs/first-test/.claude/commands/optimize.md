---
description: Analyze code for performance issues and provide actionable optimizations
argument-hint: [file path or code selection]
allowed-tools: Read, Grep, Glob, Bash, Edit, WebSearch
---

# Code Performance Optimization Analysis

<task>
Analyze the provided code for performance bottlenecks, inefficiencies, and optimization opportunities, then implement the improvements.
</task>

<target_code>
Code to analyze: $ARGUMENTS
</target_code>

## Phase 1: Performance Analysis

<analysis_instructions>
1. Read and understand the code structure thoroughly
2. Identify performance issues in these categories:
   - **Algorithmic complexity**: O(n²) or worse operations that can be optimized
   - **Memory usage**: Unnecessary allocations, memory leaks, inefficient data structures
   - **I/O operations**: Blocking calls, redundant file/network access, missing caching
   - **Rendering/UI**: Excessive re-renders, layout thrashing, unoptimized DOM operations
   - **Database queries**: N+1 queries, missing indexes, inefficient joins
   - **Bundle size**: Unused dependencies, missing code splitting, large imports
3. Use profiling tools or benchmarks when applicable:
   ```bash
   # Examples based on technology
   npm run build -- --analyze  # For bundle analysis
   node --prof script.js       # For Node.js profiling
   # Performance.now() in browser for timing
   ```
4. Look for common anti-patterns:
   - Loops inside loops
   - Synchronous operations in async contexts
   - Missing memoization/caching
   - Inefficient string concatenation
   - Premature optimization vs real bottlenecks
</analysis_instructions>

<analysis_constraints>
- Base your analysis on actual code, not assumptions
- Measure before optimizing when possible
- Focus on real bottlenecks, avoid premature optimization
- Consider the trade-off between code complexity and performance gains
- Verify that "optimizations" don't break existing functionality
</analysis_constraints>

<expected_analysis_output>
Provide a structured analysis with:
1. **Performance Issues Found** (ordered by impact: high/medium/low)
   - Issue description with file path and line numbers
   - Current complexity/performance characteristics
   - Estimated impact on application performance
2. **Root Causes**
   - Why these issues exist
   - What triggers the performance problems
3. **Recommended Optimizations**
   - Specific changes to make
   - Expected performance improvement
   - Any trade-offs or risks
</expected_analysis_output>

## Phase 2: Optimization Implementation

<implementation_instructions>
1. Prioritize optimizations by impact vs effort
2. Implement changes incrementally, one optimization at a time
3. For each optimization:
   - Explain what you're changing and why
   - Show before/after code comparison
   - Preserve existing functionality
   - Add comments explaining the optimization
4. Use proven optimization techniques:
   - **Caching**: Memoize expensive calculations
   - **Lazy loading**: Load resources only when needed
   - **Debouncing/Throttling**: Reduce frequency of expensive operations
   - **Batch operations**: Combine multiple operations into one
   - **Better algorithms**: Replace O(n²) with O(n log n) or O(n)
   - **Data structure optimization**: Use Maps/Sets instead of arrays where appropriate
   - **Code splitting**: Split large bundles into smaller chunks
</implementation_instructions>

<implementation_rules>
- Implement actual optimizations, do NOT just add comments or TODOs
- Ensure code remains readable and maintainable
- Do not sacrifice code clarity for minor performance gains
- Add comments explaining non-obvious optimizations
- Preserve all existing functionality and edge case handling
- If an optimization might break something, mention it and ask for confirmation
</implementation_rules>

<testing_requirements>
After implementing optimizations:
1. Run existing tests to ensure no regressions:
   ```bash
   npm test
   ```
2. Benchmark performance improvements when possible:
   - Use console.time/timeEnd for timing comparisons
   - Compare memory usage before/after
   - Measure bundle size changes
   - Test with realistic data volumes
3. Verify functionality with edge cases
4. Check for any new performance issues introduced
</testing_requirements>

## Phase 3: Verification & Documentation

<verification_instructions>
1. **Measure improvements**:
   - Quantify performance gains (e.g., "reduced from 500ms to 50ms")
   - Compare memory usage before/after
   - Show bundle size reduction if applicable
2. **Document changes**:
   - Summarize what was optimized
   - List performance improvements achieved
   - Note any trade-offs or considerations for future development
3. **Provide recommendations** for future optimizations:
   - Monitoring suggestions
   - Performance budgets to maintain
   - Areas that might need optimization later
</verification_instructions>

<expected_final_output>
Provide a comprehensive report:

### Optimizations Implemented
- List of changes with file references (e.g., utils.js:45-67)
- Brief description of each optimization

### Performance Improvements
- Quantified improvements (timing, memory, bundle size)
- Before/after comparisons

### Trade-offs & Considerations
- Any complexity added
- Maintenance considerations
- Browser/environment compatibility notes

### Future Recommendations
- Additional optimization opportunities
- Monitoring and profiling suggestions
- Performance budget recommendations
</expected_final_output>

---

<important_notes>
- Always measure before and after optimization
- Focus on real bottlenecks, not theoretical ones
- Readability and maintainability matter more than micro-optimizations
- Test thoroughly to ensure no regressions
- Document the reasoning behind non-obvious optimizations
</important_notes>